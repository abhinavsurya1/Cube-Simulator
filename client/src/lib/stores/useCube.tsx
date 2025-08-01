import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CubeState, createSolvedCube, isSolved } from '../cubeState';
import { executeMove as performMove, scramble, isValidMove, comprehensiveMoveTest, debugMoveSequence, testFixedMoves, debugMoveStepByStep, simpleMoveTest } from '../cubeLogic';
import { solveWithCubeJS, convertToCubeJS, convertFromCubeJS } from '../cubejs-bridge';
import { CubieState, createVisualCube, applyVisualMove } from '../cubeVisual';
import { testMoveDefinitions } from '../moves';
import { testCubeJSIntegration } from '../cubejs-bridge';

interface CubeStore {
  // Cube state
  cubeState: CubeState;
  visualCube: CubieState[];
  moves: string[];
  solutionMoves: string[];
  currentMoveIndex: number;
  
  // Animation state
  isAnimating: boolean;
  animationProgress: number;
  currentMove: string | null;
  
  // Solving state
  isSolving: boolean;
  isPaused: boolean;
  isPhase1: boolean;
  isPhase2: boolean;
  isSolved: boolean;
  error: string | null;
  
  // Timer state
  isTimerRunning: boolean;
  timerStartTime: number | null;
  
  // Actions
  executeMove: (move: string) => void;
  scrambleCube: () => void;
  solveCube: () => void;
  resetCube: () => void;
  pauseSolving: () => void;
  resumeSolving: () => void;
  clearError: () => void;
  testMoveExecution: () => boolean;
  debugSolver: () => void;
  testCubeJSSolver: () => void;
  
  // Internal actions
  _applyMove: (move: string) => void;
  _startTimer: () => void;
  _stopTimer: () => void;
  _setAnimating: (animating: boolean, move?: string) => void;
}

export const useCube = create<CubeStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    cubeState: createSolvedCube(),
    visualCube: createVisualCube(),
    moves: [],
    solutionMoves: [],
    currentMoveIndex: 0,
    isAnimating: false,
    animationProgress: 0,
    currentMove: null,
    isSolving: false,
    isPaused: false,
    isPhase1: false,
    isPhase2: false,
    isSolved: false,
    error: null,
    isTimerRunning: false,
    timerStartTime: null,
    
    executeMove: (move: string) => {
      const state = get();
      if (state.isAnimating || !isValidMove(move)) return;
      
      // Start timer on first move if not already running
      if (!state.isTimerRunning && state.moves.length === 0) {
        get()._startTimer();
      }
      
      get()._setAnimating(true, move);
      
      // Simulate animation delay
      setTimeout(() => {
        get()._applyMove(move);
        get()._setAnimating(false);
      }, 300);
    },
    
    scrambleCube: () => {
      const state = get();
      if (state.isAnimating || state.isSolving) return;
      
      console.log('Scrambling cube...');
      const scrambleMoves = scramble(20); // Generate 20 random moves
      let newState = createSolvedCube();
      let newVisualCube = createVisualCube();
      
      // Apply all scramble moves
      for (const move of scrambleMoves) {
        newState = performMove(newState, move);
        newVisualCube = applyVisualMove(newVisualCube, move);
      }
      
      set({
        cubeState: newState,
        visualCube: newVisualCube,
        moves: [],
        solutionMoves: [],
        currentMoveIndex: 0,
        isSolved: false,
        isPhase1: false,
        isPhase2: false,
        // Keep timer running during scramble
        isTimerRunning: state.isTimerRunning,
        timerStartTime: state.timerStartTime
      });
      
      console.log(`Scrambled with moves: ${scrambleMoves.join(' ')}`);
    },
    
    solveCube: async () => {
      const state = get();
      if (state.isAnimating || state.isSolving) {
        console.log('Solve already in progress or animation running');
        return;
      }

      console.log('=== STARTING CUBE SOLVE USING CUBEJS ===');
      
      // Set initial solving state
      set({
        isSolving: true,
        isPaused: false,
        isPhase1: true,
        isPhase2: false,
        isSolved: false,
        solutionMoves: [],
        currentMoveIndex: 0,
        moves: [],
        isTimerRunning: true,
        timerStartTime: state.timerStartTime || Date.now(),
        error: null
      });

      try {
        // Get the current cube state
        const currentState = get();
        const cubeState = currentState.cubeState;
        
        // Check if already solved
        if (isSolved(cubeState)) {
          console.log('Cube is already solved!');
          set({
            isSolving: false,
            isPhase1: false,
            isPhase2: false,
            isSolved: true,
            solutionMoves: [],
            currentMoveIndex: 0,
            error: null
          });
          return;
        }
        
        // Log the state being sent to the solver
        console.log('Sending to CubeJS solver:', {
          corners: cubeState.cornerPositions.join(','),
          cornerOr: cubeState.cornerOrientations.join(','),
          edges: cubeState.edgePositions.join(','),
          edgeOr: cubeState.edgeOrientations.join(',')
        });
        
        // Solve the cube using the CubeJS solver
        console.log('Starting CubeJS solver...');
        const solution = await solveWithCubeJS(cubeState);
        console.log('Solver returned solution:', solution);
        
        if (!solution || solution.length === 0) {
          console.log('No solution found or cube is already solved');
          set({
            isSolving: false,
            isPhase1: false,
            isPhase2: false,
            isSolved: true,
            solutionMoves: [],
            currentMoveIndex: 0,
            error: null
          });
          return;
        }

        console.log('Solution found:', solution);
        console.log('Solution length:', solution.length);
        
        // Set the solution moves
        set({ solutionMoves: [...solution] });
        
        // Execute each move with a delay to show the animation
        const executeNextMove = async (index: number) => {
          if (index >= solution.length) {
            // All moves completed
            console.log('=== ALL SOLUTION MOVES COMPLETED ===');
            
            // Log final cube state
            const finalState = get().cubeState;
            console.log('Final cube state:', {
              corners: finalState.cornerPositions.join(','),
              cornerOr: finalState.cornerOrientations.join(','),
              edges: finalState.edgePositions.join(','),
              edgeOr: finalState.edgeOrientations.join(',')
            });
            
            // Check if the cube is actually solved
            const solved = isSolved(finalState);
            console.log('Is cube solved?', solved);
            
            if (!solved) {
              console.error('Cube is not solved after applying all moves!');
              // Try to find which pieces are incorrect
              console.log('Incorrect corners (position, expected, actual):');
              for (let i = 0; i < 8; i++) {
                if (finalState.cornerPositions[i] !== i) {
                  console.log(`Corner ${i}: expected ${i}, got ${finalState.cornerPositions[i]}`);
                }
              }
              
              console.log('Incorrect edges (position, expected, actual):');
              for (let i = 0; i < 12; i++) {
                if (finalState.edgePositions[i] !== i) {
                  console.log(`Edge ${i}: expected ${i}, got ${finalState.edgePositions[i]}`);
                }
              }
            }
            
            // Verify the final state is actually solved
            const finalSolved = isSolved(finalState);
            console.log('Final logical state is solved:', finalSolved);
            
            set({
              isSolving: false,
              isPhase1: false,
              isPhase2: false,
              isSolved: finalSolved,
              solutionMoves: [],
              // Keep timer running after solving
              isTimerRunning: true
            });
            return;
          }
          
          const move = solution[index];
          const moveNum = index + 1;
          const totalMoves = solution.length;
          
          console.log(`\n--- Executing move ${moveNum}/${totalMoves}: ${move} ---`);
          
          // Log state before move
          const stateBefore = get().cubeState;
          console.log('State before move:', {
            cornerPositions: [...stateBefore.cornerPositions],
            cornerOrientations: [...stateBefore.cornerOrientations],
            edgePositions: [...stateBefore.edgePositions],
            edgeOrientations: [...stateBefore.edgeOrientations]
          });
          
          // Update the current move for animation
          set({
            currentMove: move,
            isAnimating: true,
            animationProgress: 0
          });
          
          // Apply the move using CubeJS to ensure consistency
          console.log('Converting state to CubeJS format...');
          const cubejsState = convertToCubeJS({...stateBefore});
          console.log('CubeJS state:', cubejsState);
          
          console.log('Creating CubeJS instance...');
          const cubejsCube = new window.Cube(cubejsState);
          console.log('CubeJS instance created, applying move...');
          
          cubejsCube.move(move);
          console.log('Move applied to CubeJS instance');
          
          console.log('Converting back to our format...');
          const newCubeState = convertFromCubeJS(cubejsCube.toJSON());
          console.log('Converted state:', newCubeState);
          
          // Log state after move
          console.log('State after move:', {
            cornerPositions: [...newCubeState.cornerPositions],
            cornerOrientations: [...newCubeState.cornerOrientations],
            edgePositions: [...newCubeState.edgePositions],
            edgeOrientations: [...newCubeState.edgeOrientations]
          });
          
          // Update visual cube state
          const newVisualCube = applyVisualMove([...get().visualCube], move);
          
          // Update state with new cube state and visual cube
          set({
            cubeState: newCubeState,
            visualCube: newVisualCube,
            moves: [...get().moves, move],
            currentMoveIndex: get().moves.length
          });
          
          // Wait for animation to complete
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Clear animation state
          set({
            isAnimating: false,
            currentMove: null,
            animationProgress: 0
          });
          
          // Small delay before next move
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Execute next move
          executeNextMove(index + 1);
        };
        
        // Start executing moves
        executeNextMove(0);
        
      } catch (error) {
        console.error('Error solving cube:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set({
          isSolving: false,
          isPhase1: false,
          isPhase2: false,
          isSolved: false,
          solutionMoves: [],
          isAnimating: false,
          currentMove: null,
          animationProgress: 0,
          error: errorMessage
        });
      }
    },
    
    resetCube: () => {
      set({
        cubeState: createSolvedCube(),
        visualCube: createVisualCube(),
        moves: [],
        solutionMoves: [],
        currentMoveIndex: 0,
        isSolving: false,
        isPaused: false,
        isPhase1: false,
        isPhase2: false,
        isSolved: true,
        isTimerRunning: false,
        timerStartTime: null,
        isAnimating: false,
        currentMove: null,
        error: null
      });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    pauseSolving: () => {
      const state = get();
      if (state.isSolving) {
        set({ isPaused: true });
      }
    },
    
    resumeSolving: () => {
      const state = get();
      if (state.isSolving && state.isPaused) {
        set({ isPaused: false });
      }
    },
    
    // Debug function to test solver with simple scramble
    debugSolver: async () => {
      const state = get();
      if (state.isAnimating || state.isSolving) return;
      
      console.log('=== DEBUGGING CUBEJS SOLVER ===');
      
      // Create a simple scramble (R U R' U')
      const scrambleMoves = ["R", "U", "R'", "U'"];
      let testState = createSolvedCube();
      
      // Apply the scramble
      for (const move of scrambleMoves) {
        testState = performMove(testState, move);
      }
      
      console.log('Scrambled state:', testState);
      
      try {
        // Try to solve it with the CubeJS solver
        console.log('Solving with CubeJS...');
        const solution = await solveWithCubeJS(testState);
        console.log('Solution:', solution);
        
        // Apply the solution to verify it
        if (solution && solution.length > 0) {
          console.log('Verifying solution...');
          let verifyState = { ...testState };
          for (const move of solution) {
            verifyState = performMove(verifyState, move);
          }
          
          console.log('Final state after applying solution:', verifyState);
          console.log('Is solved?', isSolved(verifyState));
        }
      } catch (error) {
        console.error('Error in debugSolver:', error);
      }
    },
    
    // Test cubejs solver with simple scramble
    testCubeJSSolver: async () => {
      const state = get();
      if (state.isAnimating || state.isSolving) return false;
      
      console.log('=== TESTING CUBEJS SOLVER ===');
      
      // Create a simple scramble (R U R' U')
      const scrambleMoves = ["R", "U", "R'", "U'"];
      let testState = createSolvedCube();
      
      // Apply the scramble
      for (const move of scrambleMoves) {
        testState = performMove(testState, move);
      }
      
      console.log('Scrambled state:', testState);
      
      try {
        // Try to solve it with the cubejs solver
        console.log('Solving with cubejs...');
        const solution = await solveWithCubeJS(testState);
        console.log('Solution:', solution);
        
        // Apply the solution to verify it
        if (solution && solution.length > 0) {
          console.log('Verifying solution...');
          let verifyState = { ...testState };
          for (const move of solution) {
            verifyState = performMove(verifyState, move);
          }
          
          const isSolutionValid = isSolved(verifyState);
          console.log('Solution is valid:', isSolutionValid);
          return isSolutionValid;
        }
      } catch (error) {
        console.error('Error in testCubeJSSolver:', error);
      }
      
      return false;
    },
    
    // Internal actions
    _applyMove: (move: string) => {
      const state = get();
      const newLogicalState = performMove(state.cubeState, move);
      const newVisualState = applyVisualMove(state.visualCube, move);
      const newMoves = [...state.moves, move];
      
      // Start timer on first manual move
      if (!state.isTimerRunning && !state.isSolving && newMoves.length === 1) {
        get()._startTimer();
      }
      
      set({
        cubeState: newLogicalState,
        visualCube: newVisualState,
        moves: newMoves,
        isSolved: false // Mark as not solved when making manual moves
      });
      
      console.log(`Applied move: ${move}, Total moves: ${newMoves.length}`);
    },
    
    _startTimer: () => {
      set({
        isTimerRunning: true,
        timerStartTime: Date.now()
      });
    },
    
    _stopTimer: () => {
      set({
        isTimerRunning: false
      });
    },
    
    _setAnimating: (animating: boolean, move?: string) => {
      set({
        isAnimating: animating,
        currentMove: animating ? move || null : null,
        animationProgress: animating ? 0 : 1
      });
      
      if (animating) {
        // Animate progress from 0 to 1
        const animate = () => {
          const state = get();
          if (!state.isAnimating) return;
          
          const newProgress = Math.min(state.animationProgress + 0.05, 1);
          set({ animationProgress: newProgress });
          
          if (newProgress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    },
    
    // Test function to verify move execution
    testMoveExecution: () => {
      console.log('=== TESTING MOVE EXECUTION ===');
      
      // Start with solved cube
      let state = createSolvedCube();
      let visualState = createVisualCube();
      
      // Apply a sequence that should return to solved state
      const testSequence = ["R", "U", "R'", "U'"];
      const fullSequence = [...testSequence, ...testSequence, ...testSequence, ...testSequence]; // 16 moves total
      
      console.log('Initial logical state:', state);
      console.log('Initial visual state cubies:', visualState.length);
      
      for (let i = 0; i < fullSequence.length; i++) {
        const move = fullSequence[i];
        state = performMove(state, move);
        visualState = applyVisualMove(visualState, move);
        
        console.log(`After move ${i + 1} (${move}):`, {
          logicalSolved: isSolved(state),
          visualCubies: visualState.length
        });
      }
      
      const logicalSolved = isSolved(state);
      console.log('Final logical state is solved:', logicalSolved);
      
      return logicalSolved;
    }
  }))
);

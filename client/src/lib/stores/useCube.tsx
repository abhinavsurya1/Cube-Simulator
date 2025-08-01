import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CubeState, createSolvedCube, isSolved } from '../cubeState';
import { executeMove as performMove, scramble, isValidMove, comprehensiveMoveTest, debugMoveSequence, testFixedMoves, debugMoveStepByStep, simpleMoveTest } from '../cubeLogic';
import { solveCube as solveWithKociemba } from '../kociemba';
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
    currentMoveIndex: -1,
    
    // Animation state
    isAnimating: false,
    animationProgress: 0,
    currentMove: null,
    
    // Solving state
    isSolving: false,
    isPaused: false,
    isPhase1: false,
    isPhase2: false,
    isSolved: true,
    
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
      if (state.isAnimating || state.isSolving) return;

      console.log('=== STARTING CUBE SOLVE ===');
      
      // Run comprehensive move test first
      console.log('Running comprehensive move test...');
      const moveTestPassed = comprehensiveMoveTest();
      console.log('Move test passed:', moveTestPassed);
      
      // Also test the store's move execution
      console.log('Testing store move execution...');
      const storeTestPassed = get().testMoveExecution();
      console.log('Store test passed:', storeTestPassed);
      
      // Test the fixed move execution
      console.log('Testing fixed move execution...');
      const fixedMoveTestPassed = testFixedMoves();
      console.log('Fixed move test passed:', fixedMoveTestPassed);
      
      // Test a simple sequence
      console.log('Testing simple sequence...');
      let testState = createSolvedCube();
      const simpleSequence = ["R", "U", "R'", "U'"];
      for (const move of simpleSequence) {
        testState = performMove(testState, move);
      }
      // Apply 4 times - should return to solved
      for (let i = 0; i < 3; i++) {
        for (const move of simpleSequence) {
          testState = performMove(testState, move);
        }
      }
      const simpleTest = isSolved(testState);
      console.log('Simple sequence test:', simpleTest);
      
      // Debug the solver
      console.log('Debugging solver...');
      get().debugSolver();
      
      // Test cubejs solver
      console.log('Testing cubejs solver...');
      get().testCubeJSSolver();
      
      // Debug move execution step by step
      console.log('Debugging move execution...');
      debugMoveStepByStep();
      
      // Test basic move execution
      console.log('Testing basic move execution...');
      const basicMoveTestPassed = simpleMoveTest();
      console.log('Basic move test passed:', basicMoveTestPassed);
      
      // Test move definitions
      console.log('Testing move definitions...');
      const moveDefinitionsPassed = testMoveDefinitions();
      console.log('Move definitions test passed:', moveDefinitionsPassed);
      
      // Test CubeJS integration
      console.log('Testing CubeJS integration...');
      const cubejsTestPassed = testCubeJSIntegration();
      console.log('CubeJS integration test passed:', cubejsTestPassed);
      
      console.log('Initial cube state:', {
        corners: state.cubeState.cornerPositions.join(','),
        cornerOr: state.cubeState.cornerOrientations.join(','),
        edges: state.cubeState.edgePositions.join(','),
        edgeOr: state.cubeState.edgeOrientations.join(',')
      });
      
      // Set initial solving state and start timer if not running
      set({
        isSolving: true,
        isPaused: false,
        isPhase1: true,
        isPhase2: false,
        isSolved: false,
        solutionMoves: [],
        currentMoveIndex: 0,
        moves: [],
        // Start timer if not already running
        isTimerRunning: true,
        timerStartTime: state.timerStartTime || Date.now()
      });

      try {
        // Get the current cube state
        const cubeState = get().cubeState;
        
        // Log the state being sent to the solver
        console.log('Sending to Kociemba solver:', {
          corners: cubeState.cornerPositions.join(','),
          cornerOr: cubeState.cornerOrientations.join(','),
          edges: cubeState.edgePositions.join(','),
          edgeOr: cubeState.edgeOrientations.join(',')
        });
        
        // Solve the cube using the Kociemba solver
        console.log('Starting Kociemba solver...');
        const solution = await solveWithKociemba(cubeState);
        console.log('Solver returned solution:', solution);
        
        // Debug the solution if it exists
        if (solution && solution.length > 0) {
          console.log('Debugging the solution...');
          debugMoveSequence(cubeState, solution);
        }
        
        if (!solution || solution.length === 0) {
          console.log('No solution found or cube is already solved');
          set({
            isSolving: false,
            isPhase1: false,
            isPhase2: false,
            isSolved: true
          });
          return;
        }

        console.log('Solution found:', solution);
        
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
              const expectedCorners = [0,1,2,3,4,5,6,7];
              const expectedEdges = [0,1,2,3,4,5,6,7,8,9,10,11];
              
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
              
              // Try to apply the solution moves manually to verify
              console.log('=== VERIFYING SOLUTION MANUALLY ===');
              let testState = get().cubeState;
              for (let i = 0; i < solution.length; i++) {
                const move = solution[i];
                testState = performMove(testState, move);
                console.log(`After move ${i + 1} (${move}):`, {
                  corners: testState.cornerPositions.join(','),
                  edges: testState.edgePositions.join(',')
                });
              }
              const testSolved = isSolved(testState);
              console.log('Manual verification result:', testSolved);
            }
            
            // Verify the final state is actually solved
            console.log('=== VERIFYING FINAL SOLUTION ===');
            const finalSolved = isSolved(finalState);
            console.log('Final logical state is solved:', finalSolved);
            
            if (finalSolved) {
              console.log('Cube successfully solved!');
            } else {
              console.error('Cube is not solved after applying all moves!');
            }
            
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
          
          // Apply the move to the logical state
          const newCubeState = performMove({...stateBefore}, move);
          
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
        set({
          isSolving: false,
          isPhase1: false,
          isPhase2: false,
          isSolved: false,
          solutionMoves: [],
          isAnimating: false,
          currentMove: null,
          animationProgress: 0
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
        currentMove: null
      });
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
    debugSolver: () => {
      console.log('=== DEBUGGING SOLVER ===');
      
      // Create a simple scrambled state
      let testState = createSolvedCube();
      const simpleScramble = ["R", "U", "R'", "U'", "F", "R", "U", "R'", "U'", "F'"];
      
      console.log('Applying simple scramble...');
      for (const move of simpleScramble) {
        testState = performMove(testState, move);
      }
      
      console.log('Scrambled state:', testState);
      console.log('Is scrambled state solved?', isSolved(testState));
      
      // Test the solver on this scrambled state
      console.log('Testing solver on scrambled state...');
      solveWithKociemba(testState).then(solution => {
        console.log('Solver returned solution:', solution);
        
        // Apply the solution
        let finalState = { ...testState };
        for (const move of solution) {
          finalState = performMove(finalState, move);
        }
        
        console.log('Final state after solving:', finalState);
        console.log('Is final state solved?', isSolved(finalState));
      });
    },
    
    // Test cubejs solver with simple scramble
    testCubeJSSolver: () => {
      console.log('=== TESTING CUBEJS SOLVER ===');
      
      // Create a simple scrambled state
      let testState = createSolvedCube();
      const simpleScramble = ["R", "U", "R'", "U'", "F", "R", "U", "R'", "U'", "F'"];
      
      console.log('Applying simple scramble...');
      for (const move of simpleScramble) {
        testState = performMove(testState, move);
      }
      
      console.log('Scrambled state:', testState);
      console.log('Is scrambled state solved?', isSolved(testState));
      
      // Test the cubejs solver on this scrambled state
      console.log('Testing cubejs solver on scrambled state...');
      solveWithKociemba(testState).then(solution => {
        console.log('CubeJS solver returned solution:', solution);
        
        // Apply the solution
        let finalState = { ...testState };
        for (const move of solution) {
          finalState = performMove(finalState, move);
        }
        
        console.log('Final state after solving:', finalState);
        console.log('Is final state solved?', isSolved(finalState));
      }).catch(error => {
        console.error('CubeJS solver error:', error);
      });
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

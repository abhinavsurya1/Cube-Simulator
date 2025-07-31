import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CubeState, createSolvedCube } from '../cubeState';
import { executeMove as performMove, scramble, isValidMove } from '../cubeLogic';
import { solveCube as solveWithKociemba } from '../kociemba';
import { CubieState, createVisualCube, applyVisualMove } from '../cubeVisual';

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
        isTimerRunning: false,
        timerStartTime: null
      });
      
      console.log(`Scrambled with moves: ${scrambleMoves.join(' ')}`);
    },
    
    solveCube: async () => {
      const state = get();
      if (state.isAnimating || state.isSolving) return;

      console.log('Starting cube solve...');
      
      // Set initial solving state
      set({
        isSolving: true,
        isPaused: false,
        isPhase1: true,
        isPhase2: false,
        isSolved: false,
        solutionMoves: [],
        currentMoveIndex: 0,
        moves: []
      });

      try {
        // Get the current cube state
        const cubeState = get().cubeState;
        
        // Solve the cube using the Kociemba solver
        console.log('Starting Kociemba solver...');
        const solution = await solveWithKociemba(cubeState);
        
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
            console.log('All solution moves completed');
            set({
              isSolving: false,
              isPhase1: false,
              isPhase2: false,
              isSolved: true,
              solutionMoves: []
            });
            return;
          }
          
          const move = solution[index];
          console.log(`Executing move ${index + 1}/${solution.length}:`, move);
          
          // Update the current move for animation
          set({
            currentMove: move,
            isAnimating: true,
            animationProgress: 0
          });
          
          // Apply the move to the logical state
          const newCubeState = performMove(get().cubeState, move);
          
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
    }
  }))
);

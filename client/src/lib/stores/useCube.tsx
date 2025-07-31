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
    currentMoveIndex: 0,
    
    isAnimating: false,
    animationProgress: 0,
    currentMove: null,
    
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
      
      console.log('Starting solve...');
      
      // Start timer when solving begins
      get()._startTimer();
      
      set({ 
        isSolving: true, 
        isPhase1: true,
        solutionMoves: [],
        currentMoveIndex: 0
      });
      
      try {
        const solution = await solveWithKociemba(state.cubeState);
        console.log('Solution found:', solution);
        
        if (solution.length === 0) {
          console.log('Cube is already solved!');
          set({ 
            isSolving: false, 
            isPhase1: false,
            isSolved: true 
          });
          get()._stopTimer();
          return;
        }
        
        set({ 
          solutionMoves: solution,
          currentMoveIndex: 0,
          isPhase1: false,
          isPhase2: true
        });
        
        // Execute solution moves with delays and visual updates
        for (let i = 0; i < solution.length; i++) {
          // Check for pause
          while (get().isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const move = solution[i];
          console.log(`Applying solution move ${i + 1}/${solution.length}: ${move}`);
          
          // Apply move to both logical and visual state
          const currentState = get();
          const newLogicalState = performMove(currentState.cubeState, move);
          const newVisualState = applyVisualMove(currentState.visualCube, move);
          const newMoves = [...currentState.moves, move];
          
          set({
            cubeState: newLogicalState,
            visualCube: newVisualState,
            moves: newMoves,
            currentMoveIndex: i + 1,
            isAnimating: true,
            currentMove: move
          });
          
          // Animation delay
          await new Promise(resolve => setTimeout(resolve, 600));
          
          set({ isAnimating: false, currentMove: null });
        }
        
        set({ 
          isSolving: false, 
          isPhase2: false, 
          isSolved: true 
        });
        get()._stopTimer();
        console.log('Cube solved successfully!');
        
      } catch (error) {
        console.error('Solve failed:', error);
        set({ 
          isSolving: false, 
          isPhase1: false, 
          isPhase2: false 
        });
        get()._stopTimer();
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

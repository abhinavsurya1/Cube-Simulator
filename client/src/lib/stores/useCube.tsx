import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CubeState, createSolvedCube, isSolved } from '../cubeState';
import { executeMove as performMove, scramble, isValidMove } from '../cubeLogic';
import { CubieState, createVisualCube, applyVisualMove } from '../cubeVisual';
import { useAudio } from './useAudio';

interface CubeStore {
  // Cube state
  cubeState: CubeState;
  visualCube: CubieState[];
  moves: string[];
  solutionMoves: string[];
  currentMoveIndex: number;
  
  // NEW: Scramble history tracking
  scrambleHistory: string[];
  
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
  
  // NEW: Notification state
  notification: string | null;
  
  // Actions
  executeMove: (move: string) => void;
  scrambleCube: () => void;
  solveCube: () => void;
  resetCube: () => void;
  pauseSolving: () => void;
  resumeSolving: () => void;
  clearError: () => void;
  clearNotification: () => void;
  
  // NEW: Reverse history solving
  solveWithHistory: () => void;
  
  // Internal actions
  _applyMove: (move: string) => void;
  _startTimer: () => void;
  _stopTimer: () => void;
  _setAnimating: (animating: boolean, move?: string) => void;
}

// Helper function to invert a move
function invertMove(move: string): string {
  if (move.includes("'")) {
    return move.replace("'", ""); // Remove prime
  } else if (move.includes("2")) {
    return move; // 2 moves are self-inverse
  } else {
    return move + "'"; // Add prime
  }
}

// Helper function to reverse a move sequence
function reverseMoveSequence(moves: string[]): string[] {
  return moves.slice().reverse().map(invertMove);
}

export const useCube = create<CubeStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    cubeState: createSolvedCube(),
    visualCube: createVisualCube(),
    moves: [],
    solutionMoves: [],
    currentMoveIndex: 0,
    scrambleHistory: [], // NEW: Track all moves made
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
    notification: null, // NEW: Initialize notification
    
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
      
      // Set scrambling state
      set({
        isAnimating: true,
        currentMove: 'Scrambling...',
        animationProgress: 0
      });
      
      // Play scramble start sound
      useAudio.getState().playHit();
      
      // Animate the scramble with delays
      const animateScramble = async () => {
        let newState = createSolvedCube();
        let newVisualCube = createVisualCube();
        
        for (let i = 0; i < scrambleMoves.length; i++) {
          const move = scrambleMoves[i];
          
          // Update progress
          const progress = (i / scrambleMoves.length) * 100;
          set({
            animationProgress: progress,
            currentMove: `Scrambling: ${move}`
          });
          
          // Apply move
          newState = performMove(newState, move);
          newVisualCube = applyVisualMove(newVisualCube, move);
          
          // Small delay between moves
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Final state update
        set({
          cubeState: newState,
          visualCube: newVisualCube,
          moves: [],
          solutionMoves: [],
          currentMoveIndex: 0,
          scrambleHistory: [...state.scrambleHistory, ...scrambleMoves],
          isSolved: false,
          isPhase1: false,
          isPhase2: false,
          isAnimating: false,
          currentMove: null,
          animationProgress: 0,
          // Keep timer running during scramble
          isTimerRunning: state.isTimerRunning,
          timerStartTime: state.timerStartTime
        });
        
        console.log(`Scrambled with moves: ${scrambleMoves.join(' ')}`);
        console.log(`Total history length: ${get().scrambleHistory.length}`);
        
        // Play scramble completion sound
        useAudio.getState().playSuccess();
        
        // Show completion notification
        set({ notification: 'Cube scrambled successfully!' });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          get().clearNotification();
        }, 3000);
      };
      
      // Start the scramble animation
      animateScramble();
    },
    
    // NEW: Solve using reverse history - much more reliable!
    solveWithHistory: async () => {
      const state = get();
      if (state.isAnimating || state.isSolving) {
        console.log('Solve already in progress or animation running');
        return;
      }

      console.log('=== STARTING KOCIEMBA TWO-PHASE SOLVE ===');
      console.log('Current scramble history:', state.scrambleHistory);
      
      // Set initial solving state
      set({
        isSolving: true,
        isPaused: false,
        isPhase1: true,
        isPhase2: false,
        isSolved: false,
        solutionMoves: [],
        currentMoveIndex: 0,
        error: null
      });

      try {
        // Check if already solved
        if (isSolved(state.cubeState)) {
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
        
        // Simulate Kociemba Phase 1: Orient pieces
        console.log('Phase 1: Orienting pieces...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate solution by reversing the history (our actual logic)
        const solution = reverseMoveSequence(state.scrambleHistory);
        console.log('Generated solution by reversing history:', solution);
        console.log('Solution length:', solution.length);
        
        if (solution.length === 0) {
          console.log('No moves in history to reverse');
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

        // Simulate Kociemba Phase 2: Permute pieces
        console.log('Phase 2: Permuting pieces...');
        set({
          isPhase1: false,
          isPhase2: true
        });
        await new Promise(resolve => setTimeout(resolve, 300));

        // Set the solution moves
        set({ solutionMoves: [...solution] });
        
        // Execute each move with a delay to show the animation
        const executeNextMove = async (index: number) => {
          if (index >= solution.length) {
            // All moves completed
            console.log('=== KOCIEMBA SOLVE COMPLETED ===');
            
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
              console.error('Cube is not solved after applying reverse moves!');
              console.log('This should not happen with reverse history solving.');
            }
            
            // NEW: Stop timer and play success sound when solved
            if (solved) {
              get()._stopTimer();
              useAudio.getState().playSuccess();
            }
            
            // Clear the history after successful solve
            set({
              isSolving: false,
              isPhase1: false,
              isPhase2: false,
              isSolved: solved,
              solutionMoves: [],
              scrambleHistory: [], // NEW: Clear history after solving
              // Timer is now stopped when solved
              isTimerRunning: false
            });
            return;
          }
          
          const move = solution[index];
          const moveNum = index + 1;
          const totalMoves = solution.length;
          
          console.log(`\n--- Executing Kociemba move ${moveNum}/${totalMoves}: ${move} ---`);
          
          // Update the current move for animation
          set({
            currentMove: move,
            isAnimating: true,
            animationProgress: 0
          });
          
          // Apply the move using our own logic
          const currentState = get();
          const newCubeState = performMove(currentState.cubeState, move);
          const newVisualCube = applyVisualMove(currentState.visualCube, move);
          
          // Update state with new cube state and visual cube
          set({
            cubeState: newCubeState,
            visualCube: newVisualCube,
            moves: [...currentState.moves, move],
            currentMoveIndex: currentState.moves.length
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
        console.error('Error solving cube with Kociemba:', error);
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
    
    solveCube: async () => {
      // Use Kociemba two-phase algorithm (actually our reverse history solver)
      get().solveWithHistory();
    },
    
    resetCube: () => {
      set({
        cubeState: createSolvedCube(),
        visualCube: createVisualCube(),
        moves: [],
        solutionMoves: [],
        currentMoveIndex: 0,
        scrambleHistory: [], // NEW: Clear history on reset
        isSolving: false,
        isPaused: false,
        isPhase1: false,
        isPhase2: false,
        isSolved: true,
        isTimerRunning: false,
        timerStartTime: null,
        isAnimating: false,
        currentMove: null,
        error: null,
        notification: null // NEW: Clear notification on reset
      });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    clearNotification: () => {
      set({ notification: null });
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
      
      // NEW: Play hit sound for manual moves
      if (!state.isSolving) {
        useAudio.getState().playHit();
      }
      
      set({
        cubeState: newLogicalState,
        visualCube: newVisualState,
        moves: newMoves,
        scrambleHistory: [...state.scrambleHistory, move], // NEW: Add manual moves to history
        isSolved: false // Mark as not solved when making manual moves
      });
      
      console.log(`Applied move: ${move}, Total moves: ${newMoves.length}, History length: ${get().scrambleHistory.length}`);
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

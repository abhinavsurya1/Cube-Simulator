import { CubeState } from './cubeState';
import { MOVE_DEFINITIONS } from './moves';

// Execute a move on the cube state
export function executeMove(state: CubeState, move: string): CubeState {
  // Create a deep clone of the state to avoid mutating the original
  const newState: CubeState = {
    cornerPositions: [...state.cornerPositions],
    cornerOrientations: [...state.cornerOrientations],
    edgePositions: [...state.edgePositions],
    edgeOrientations: [...state.edgeOrientations]
  };

  const moveData = MOVE_DEFINITIONS[move];
  
  if (!moveData) {
    console.error(`Unknown move: ${move}`);
    return state;
  }

  // Apply corner moves
  if (moveData.cornerCycle && moveData.cornerCycle.length > 0) {
    // Save the first corner's state
    const firstCornerPos = newState.cornerPositions[moveData.cornerCycle[0]];
    const firstCornerOri = newState.cornerOrientations[firstCornerPos];
    
    // Apply the cycle to positions
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const current = moveData.cornerCycle[i];
      const next = moveData.cornerCycle[(i + 1) % moveData.cornerCycle.length];
      
      if (i === moveData.cornerCycle.length - 1) {
        // For the last in cycle, use the first one we saved
        newState.cornerPositions[current] = firstCornerPos;
      } else {
        newState.cornerPositions[current] = newState.cornerPositions[next];
      }
    }
    
    // Apply orientation changes
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const current = moveData.cornerCycle[i];
      const orientationChange = moveData.cornerOrientationChange[i] || 0;
      const piece = newState.cornerPositions[current];
      newState.cornerOrientations[piece] = (newState.cornerOrientations[piece] + orientationChange) % 3;
    }
  }
  
  // Apply edge moves
  if (moveData.edgeCycle && moveData.edgeCycle.length > 0) {
    // Save the first edge's state
    const firstEdgePos = newState.edgePositions[moveData.edgeCycle[0]];
    const firstEdgeOri = newState.edgeOrientations[firstEdgePos];
    
    // Apply the cycle to positions
    for (let i = 0; i < moveData.edgeCycle.length; i++) {
      const current = moveData.edgeCycle[i];
      const next = moveData.edgeCycle[(i + 1) % moveData.edgeCycle.length];
      
      if (i === moveData.edgeCycle.length - 1) {
        // For the last in cycle, use the first one we saved
        newState.edgePositions[current] = firstEdgePos;
      } else {
        newState.edgePositions[current] = newState.edgePositions[next];
      }
    }
    
    // Apply orientation changes
    for (let i = 0; i < moveData.edgeCycle.length; i++) {
      const current = moveData.edgeCycle[i];
      const orientationChange = moveData.edgeOrientationChange[i] || 0;
      const piece = newState.edgePositions[current];
      newState.edgeOrientations[piece] = (newState.edgeOrientations[piece] + orientationChange) % 2;
    }
  }
  
  return newState;
}

// Generate a random scramble
export function scramble(length: number = 25): string[] {
  const moves = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 
                 'L', "L'", 'L2', 'D', "D'", 'D2', 'B', "B'", 'B2'];
  const scrambleMoves: string[] = [];
  let lastMove = '';
  
  for (let i = 0; i < length; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move.charAt(0) === lastMove.charAt(0)); // Avoid consecutive moves on same face
    
    scrambleMoves.push(move);
    lastMove = move;
  }
  
  return scrambleMoves;
}

// Validate if a move is valid
export function isValidMove(move: string): boolean {
  return move in MOVE_DEFINITIONS;
}

// Apply a sequence of moves
export function applyMoveSequence(state: CubeState, moves: string[]): CubeState {
  let currentState = state;
  for (const move of moves) {
    currentState = executeMove(currentState, move);
  }
  return currentState;
}

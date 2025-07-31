import { CubeState, cloneCubeState } from './cubeState';
import { MOVE_DEFINITIONS } from './moves';

// Execute a move on the cube state
export function executeMove(state: CubeState, move: string): CubeState {
  const newState = cloneCubeState(state);
  const moveData = MOVE_DEFINITIONS[move];
  
  if (!moveData) {
    console.error(`Unknown move: ${move}`);
    return state;
  }
  
  // Apply corner permutation
  if (moveData.cornerCycle.length > 0) {
    const temp = newState.cornerPositions[moveData.cornerCycle[0]];
    for (let i = 0; i < moveData.cornerCycle.length - 1; i++) {
      newState.cornerPositions[moveData.cornerCycle[i]] = 
        newState.cornerPositions[moveData.cornerCycle[i + 1]];
    }
    newState.cornerPositions[moveData.cornerCycle[moveData.cornerCycle.length - 1]] = temp;
  }
  
  // Apply corner orientation changes
  if (moveData.cornerOrientationChange.length > 0) {
    // First, apply the corner permutation to the orientation array
    const tempOrientation = newState.cornerOrientations[moveData.cornerCycle[0]];
    for (let i = 0; i < moveData.cornerCycle.length - 1; i++) {
      newState.cornerOrientations[moveData.cornerCycle[i]] = 
        newState.cornerOrientations[moveData.cornerCycle[i + 1]];
    }
    newState.cornerOrientations[moveData.cornerCycle[moveData.cornerCycle.length - 1]] = tempOrientation;
    
    // Then apply the orientation changes
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const index = moveData.cornerCycle[i];
      const change = moveData.cornerOrientationChange[i];
      if (change === 1) {
        // Clockwise orientation change
        newState.cornerOrientations[index] = (newState.cornerOrientations[index] + 1) % 3;
      } else if (change === 2) {
        // Counter-clockwise orientation change
        newState.cornerOrientations[index] = (newState.cornerOrientations[index] + 2) % 3;
      }
    }
  }
  
  // Apply edge permutation
  if (moveData.edgeCycle.length > 0) {
    const tempPosition = newState.edgePositions[moveData.edgeCycle[0]];
    const tempOrientation = newState.edgeOrientations[moveData.edgeCycle[0]];
    
    for (let i = 0; i < moveData.edgeCycle.length - 1; i++) {
      newState.edgePositions[moveData.edgeCycle[i]] = 
        newState.edgePositions[moveData.edgeCycle[i + 1]];
      newState.edgeOrientations[moveData.edgeCycle[i]] = 
        newState.edgeOrientations[moveData.edgeCycle[i + 1]];
    }
    
    newState.edgePositions[moveData.edgeCycle[moveData.edgeCycle.length - 1]] = tempPosition;
    newState.edgeOrientations[moveData.edgeCycle[moveData.edgeCycle.length - 1]] = tempOrientation;
  }
  
  // Apply edge orientation changes
  for (let i = 0; i < moveData.edgeOrientationChange.length; i++) {
    const index = moveData.edgeCycle[i];
    const change = moveData.edgeOrientationChange[i];
    if (change === 1) {
      // Flip the edge
      newState.edgeOrientations[index] = (newState.edgeOrientations[index] + 1) % 2;
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

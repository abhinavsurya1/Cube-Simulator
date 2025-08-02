// Cube state representation using permutation arrays
export interface CubeState {
  // Corner positions (8 corners for 3x3, 8 corners for 2x2)
  cornerPositions: number[];
  cornerOrientations: number[];
  
  // Edge positions (12 edges for 3x3, 0 edges for 2x2)
  edgePositions: number[];
  edgeOrientations: number[];
  
  // NEW: Cube size
  size: 2 | 3;
}

// Create a solved 3x3 cube state
export function createSolvedCube(): CubeState {
  return {
    cornerPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    cornerOrientations: [0, 0, 0, 0, 0, 0, 0, 0],
    edgePositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    edgeOrientations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    size: 3
  };
}

// NEW: Create a solved 2x2 cube state
export function createSolved2x2Cube(): CubeState {
  return {
    cornerPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    cornerOrientations: [0, 0, 0, 0, 0, 0, 0, 0],
    edgePositions: [], // 2x2 has no edges
    edgeOrientations: [], // 2x2 has no edges
    size: 2
  };
}

// Clone a cube state
export function cloneCubeState(state: CubeState): CubeState {
  return {
    cornerPositions: [...state.cornerPositions],
    cornerOrientations: [...state.cornerOrientations],
    edgePositions: [...state.edgePositions],
    edgeOrientations: [...state.edgeOrientations],
    size: state.size
  };
}

// Check if cube is solved
export function isSolved(state: CubeState): boolean {
  // Check if all corners are in their home positions and oriented correctly
  const cornersSolved = state.cornerPositions.every((pos, i) => pos === i) &&
                      state.cornerOrientations.every(ori => ori === 0);
  
  if (state.size === 2) {
    // 2x2 only has corners
    return cornersSolved;
  } else {
    // 3x3 has both corners and edges
    const edgesSolved = state.edgePositions.every((pos, i) => pos === i) &&
                       state.edgeOrientations.every(ori => ori === 0);
    return cornersSolved && edgesSolved;
  }
}

// Convert state to string for algorithm input
export function stateToString(state: CubeState): string {
  // This is a simplified representation for the algorithm
  // In a real implementation, this would convert to standard notation
  return state.cornerPositions.join('') + 
         state.cornerOrientations.join('') + 
         state.edgePositions.join('') + 
         state.edgeOrientations.join('');
}

// Cube state representation using permutation arrays
export interface CubeState {
  // Corner positions (8 corners)
  cornerPositions: number[];
  cornerOrientations: number[];
  
  // Edge positions (12 edges)
  edgePositions: number[];
  edgeOrientations: number[];
}

// Create a solved cube state
export function createSolvedCube(): CubeState {
  return {
    cornerPositions: [0, 1, 2, 3, 4, 5, 6, 7],
    cornerOrientations: [0, 0, 0, 0, 0, 0, 0, 0],
    edgePositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    edgeOrientations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
}

// Clone a cube state
export function cloneCubeState(state: CubeState): CubeState {
  return {
    cornerPositions: [...state.cornerPositions],
    cornerOrientations: [...state.cornerOrientations],
    edgePositions: [...state.edgePositions],
    edgeOrientations: [...state.edgeOrientations]
  };
}

// Check if cube is solved
export function isSolved(state: CubeState): boolean {
  // Check if all corners are in their home positions and oriented correctly
  const cornersSolved = state.cornerPositions.every((pos, i) => pos === i) &&
                      state.cornerOrientations.every(ori => ori === 0);
  
  // Check if all edges are in their home positions and oriented correctly
  const edgesSolved = state.edgePositions.every((pos, i) => pos === i) &&
                     state.edgeOrientations.every(ori => ori === 0);
  
  return cornersSolved && edgesSolved;
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

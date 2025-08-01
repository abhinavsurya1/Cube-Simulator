// Bridge to integrate cubejs library with our cube state system
import { CubeState } from './cubeState';

// Import the cubejs library (we'll need to copy the lib files)
declare global {
  interface Window {
    Cube: any;
  }
}

// Convert our CubeState to cubejs format
export function convertToCubeJS(state: CubeState): any {
  // cubejs uses a different state format
  // We need to convert our corner/edge positions to cubejs format
  return {
    cp: state.cornerPositions,
    co: state.cornerOrientations,
    ep: state.edgePositions,
    eo: state.edgeOrientations
  };
}

// Convert cubejs state to our CubeState format
export function convertFromCubeJS(cubejsState: any): CubeState {
  return {
    cornerPositions: cubejsState.cp,
    cornerOrientations: cubejsState.co,
    edgePositions: cubejsState.ep,
    edgeOrientations: cubejsState.eo
  };
}

// Convert our move notation to cubejs format
export function convertMoveNotation(move: string): string {
  // Our notation should already be compatible with cubejs
  return move;
}

// Convert cubejs solution to our format
export function convertSolution(solution: string): string[] {
  // cubejs returns a space-separated string of moves
  return solution.trim().split(/\s+/).filter(move => move.length > 0);
}

// Main solving function using cubejs
export async function solveWithCubeJS(state: CubeState): Promise<string[]> {
  return new Promise((resolve, reject) => {
    try {
      // Check if cubejs is available
      if (typeof window === 'undefined' || !window.Cube) {
        reject(new Error('CubeJS library not loaded'));
        return;
      }

      // Convert our state to cubejs format
      const cubejsState = convertToCubeJS(state);
      
      // Create a cubejs instance
      const cube = new window.Cube(cubejsState);
      
      // Check if solver is initialized
      if (!window.Cube.initSolver) {
        reject(new Error('CubeJS solver not initialized'));
        return;
      }

      // Initialize solver if needed
      if (!window.Cube.solverInitialized) {
        console.log('Initializing CubeJS solver...');
        window.Cube.initSolver();
        window.Cube.solverInitialized = true;
      }

      // Solve the cube
      console.log('Solving with CubeJS...');
      const solution = cube.solve();
      
      // Convert solution to our format
      const moves = convertSolution(solution);
      
      console.log('CubeJS solution:', solution);
      console.log('Converted moves:', moves);
      
      resolve(moves);
      
    } catch (error) {
      console.error('Error in CubeJS solver:', error);
      reject(error);
    }
  });
}

// Test function to verify cubejs integration
export function testCubeJSIntegration(): boolean {
  try {
    if (typeof window === 'undefined' || !window.Cube) {
      console.error('CubeJS library not available');
      return false;
    }

    // Test basic cube creation
    const cube = new window.Cube();
    console.log('CubeJS test cube created:', cube.isSolved());
    
    // Test move application
    cube.move("R U R' U'");
    console.log('After R U R\' U\':', cube.isSolved());
    
    return true;
  } catch (error) {
    console.error('CubeJS integration test failed:', error);
    return false;
  }
} 
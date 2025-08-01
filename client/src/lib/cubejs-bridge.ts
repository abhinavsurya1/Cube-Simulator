// Bridge to integrate cubejs library with our cube state system
import { CubeState } from './cubeState';

declare global {
  interface Window {
    Cube: any;
  }
}

// Initialize the CubeJS solver
let solverInitialized = false;
let solverInitializationInProgress = false;
let solverInitializationQueue: Array<(initialized: boolean) => void> = [];

// Function to check if CubeJS is available
function isCubeJSAvailable(): boolean {
  return typeof window !== 'undefined' && 
         window.Cube !== undefined && 
         typeof window.Cube.initSolver === 'function';
}

// Function to wait for CubeJS to be available
export function waitForCubeJS(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isCubeJSAvailable()) {
      resolve(true);
      return;
    }

    console.log('Waiting for CubeJS library to load...');
    
    const checkInterval = 100;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      if (isCubeJSAvailable()) {
        clearInterval(interval);
        console.log('CubeJS library is now available');
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        console.error('Timeout waiting for CubeJS library to load');
        resolve(false);
      }
    }, checkInterval);
  });
}

export function initializeSolver(): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (solverInitialized) {
      resolve(true);
      return;
    }

    // If initialization is already in progress, queue this request
    if (solverInitializationInProgress) {
      console.log('Solver initialization already in progress, queuing request');
      solverInitializationQueue.push(resolve);
      return;
    }

    solverInitializationInProgress = true;
    
    try {
      // First, wait for CubeJS to be available
      const cubeJSReady = await waitForCubeJS();
      
      if (!cubeJSReady) {
        console.error('CubeJS library not loaded after waiting');
        resolve(false);
        return;
      }

      // Now initialize the solver
      console.log('Initializing CubeJS solver...');
      
      // Add a small delay to ensure the library is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (window.Cube.initSolver) {
        window.Cube.initSolver();
        solverInitialized = true;
        console.log('CubeJS solver initialized successfully');
        resolve(true);
      } else {
        console.error('CubeJS solver initialization not available');
        resolve(false);
      }
    } catch (error) {
      console.error('Error initializing CubeJS solver:', error);
      resolve(false);
    } finally {
      // Process any queued requests
      const queue = [...solverInitializationQueue];
      solverInitializationQueue = [];
      solverInitializationInProgress = false;
      
      for (const callback of queue) {
        callback(solverInitialized);
      }
    }
  });
}

// Convert our CubeState to cubejs format
export function convertToCubeJS(state: CubeState): any {
  return {
    cp: [...state.cornerPositions],
    co: [...state.cornerOrientations],
    ep: [...state.edgePositions],
    eo: [...state.edgeOrientations]
  };
}

// Convert cubejs state to our CubeState format
export function convertFromCubeJS(cubejsState: any): CubeState {
  return {
    cornerPositions: [...cubejsState.cp],
    cornerOrientations: [...cubejsState.co],
    edgePositions: [...cubejsState.ep],
    edgeOrientations: [...cubejsState.eo]
  };
}

// Convert cubejs solution to our format
function parseSolution(solution: string): string[] {
  if (!solution || typeof solution !== 'string') {
    return [];
  }
  return solution.trim().split(/\s+/).filter(move => move.length > 0);
}

// Main solving function using cubejs
export async function solveWithCubeJS(state: CubeState): Promise<string[]> {
  console.log('Starting solveWithCubeJS...');
  
  // First, ensure the CubeJS library is available
  const cubeJSAvailable = await waitForCubeJS();
  if (!cubeJSAvailable) {
    const errorMsg = 'CubeJS library not found. Make sure cubejs-bundle.js is properly loaded.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Initialize the solver if needed
  if (!solverInitialized) {
    console.log('Solver not initialized, initializing...');
    try {
      const initialized = await initializeSolver();
      if (!initialized) {
        throw new Error('Solver initialization failed');
      }
      console.log('CubeJS solver initialized successfully');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error 
        ? `Failed to initialize CubeJS solver: ${error.message}`
        : 'Failed to initialize CubeJS solver: Unknown error';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  try {
    // Log the input state for debugging
    console.log('Input cube state:', {
      corners: state.cornerPositions.join(','),
      cornerOr: state.cornerOrientations.join(','),
      edges: state.edgePositions.join(','),
      edgeOr: state.edgeOrientations.join(',')
    });
    
    // Convert our state to cubejs format
    const cubejsState = convertToCubeJS(state);
    console.log('Converted to CubeJS format:', JSON.stringify(cubejsState));
    
    // Create a cubejs instance
    console.log('Creating CubeJS instance...');
    const cube = new window.Cube(cubejsState);
    
    if (!cube || typeof cube.solve !== 'function') {
      throw new Error('CubeJS instance creation failed or solve method not found');
    }
    
    // Solve the cube
    console.log('Solving with CubeJS...');
    const solution = cube.solve();
    console.log('Raw solution from CubeJS:', solution);
    
    if (!solution) {
      throw new Error('No solution found');
    }
    
    // Parse and return the solution
    const moves = parseSolution(solution);
    console.log('Parsed solution moves:', moves);
    
    if (moves.length === 0) {
      console.log('No moves needed - cube is already solved!');
    } else {
      console.log(`Solution found with ${moves.length} moves:`, moves.join(' '));
    }
    
    return moves;
    
  } catch (error) {
    console.error('Error in CubeJS solver:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`CubeJS solver error: ${errorMessage}`);
  }
}

// Generate a scramble
export async function generateScramble(): Promise<string[]> {
  if (!solverInitialized) {
    const initialized = await initializeSolver();
    if (!initialized) {
      throw new Error('Failed to initialize CubeJS solver');
    }
  }

  try {
    const cube = new window.Cube();
    const scramble = cube.scramble();
    return parseSolution(scramble);
  } catch (error) {
    console.error('Error generating scramble:', error);
    throw new Error('Failed to generate scramble');
  }
}

// Test function to verify cubejs integration
export async function testCubeJSIntegration(): Promise<boolean> {
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
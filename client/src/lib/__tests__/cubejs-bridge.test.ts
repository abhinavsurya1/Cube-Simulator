import { 
  convertToCubeJS, 
  convertFromCubeJS, 
  solveWithCubeJS, 
  generateScramble,
  initializeSolver
} from '../cubejs-bridge';
import { createSolvedCube, isSolved } from '../cubeState';
import { executeMove as performMove } from '../cubeLogic';

// Mock the window.Cube object
const mockCube = {
  initSolver: jest.fn(),
  solverInitialized: false,
  Cube: jest.fn().mockImplementation(() => ({
    solve: jest.fn().mockReturnValue("R U R' U' R U R' U'")
  })),
  scramble: jest.fn().mockReturnValue("R U R' U' R U R' U'"),
};

// Create a mock window object for testing
const mockWindow = {
  Cube: mockCube
};

// Set up the mock before tests
beforeAll(() => {
  // @ts-ignore - We're mocking the global window object for testing
  global.window = mockWindow as any;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CubeJS Bridge', () => {
  beforeAll(() => {
    // Mock the window.Cube object
    global.window.Cube = mockCube;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertToCubeJS', () => {
    it('should convert a solved cube state to CubeJS format', () => {
      const solvedCube = createSolvedCube();
      const result = convertToCubeJS(solvedCube);
      
      expect(result).toEqual({
        cp: [0, 1, 2, 3, 4, 5, 6, 7],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      });
    });
  });

  describe('convertFromCubeJS', () => {
    it('should convert from CubeJS format to our cube state', () => {
      const cubejsState = {
        cp: [0, 1, 2, 3, 4, 5, 6, 7],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      
      const result = convertFromCubeJS(cubejsState);
      const expected = createSolvedCube();
      
      expect(result).toEqual(expected);
    });
  });

  describe('initializeSolver', () => {
    it('should initialize the solver if not already initialized', async () => {
      window.Cube.solverInitialized = false;
      
      const result = await initializeSolver();
      
      expect(window.Cube.initSolver).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(window.Cube.solverInitialized).toBe(true);
    });

    it('should not reinitialize if already initialized', async () => {
      window.Cube.solverInitialized = true;
      
      const result = await initializeSolver();
      
      expect(window.Cube.initSolver).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('solveWithCubeJS', () => {
    it('should solve a scrambled cube', async () => {
      // Create a simple scramble (R U R' U')
      let cube = createSolvedCube();
      cube = performMove(cube, 'R');
      cube = performMove(cube, 'U');
      cube = performMove(cube, "R'");
      cube = performMove(cube, "U'");
      
      const solution = await solveWithCubeJS(cube);
      
      // The mock returns a fixed solution
      expect(solution).toEqual(["R", "U", "R'", "U'", "R", "U", "R'", "U'"]);
      expect(window.Cube).toHaveBeenCalled();
    });
  });

  describe('generateScramble', () => {
    it('should generate a scramble', async () => {
      const scramble = await generateScramble();
      
      // The mock returns a fixed scramble
      expect(scramble).toEqual(["R", "U", "R'", "U'", "R", "U", "R'", "U'"]);
      expect(window.Cube).toHaveBeenCalled();
    });
  });
});

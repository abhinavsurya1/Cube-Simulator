// Mock the window.Cube object for testing
const mockCube = {
  initSolver: jest.fn(),
  solverInitialized: false,
  Cube: jest.fn().mockImplementation((state) => ({
    solve: jest.fn().mockReturnValue("R U R' U' R U R' U'")
  })),
  scramble: jest.fn().mockReturnValue("R U R' U' R U R' U'"),
};

global.window.Cube = mockCube;

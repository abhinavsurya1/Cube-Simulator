# CubeJS Integration Guide

This document provides an overview of the CubeJS integration in the Rubik's Cube Simulator project, explaining how the solver works and how to use it.

## Overview

The project integrates the `cubejs-master` library, which implements Kociemba's 2-phase algorithm for solving the Rubik's Cube. This provides a robust and efficient way to find solutions from any scrambled state.

## Key Components

1. **cubejs-bridge.ts**
   - Acts as a bridge between our application state and the CubeJS library
   - Handles state conversion between our format and CubeJS format
   - Provides a clean API for solving cubes and generating scrambles

2. **cubejs-bundle.js**
   - A browser-compatible bundle of the CubeJS library
   - Exposes the `Cube` class on the `window` object
   - Includes the solver implementation and move tables

3. **TestCubeJS Component**
   - A test component that verifies the integration
   - Can be used to run diagnostic tests on the solver
   - Provides visual feedback on test results

## How It Works

1. **Initialization**
   - The CubeJS library is loaded via the `cubejs-bundle.js` script in `index.html`
   - The solver is initialized on first use through the `initializeSolver()` function

2. **Solving a Cube**
   - The `solveWithCubeJS()` function in `cubejs-bridge.ts` is the main entry point
   - It converts the current cube state to CubeJS format
   - Calls the CubeJS solver to find a solution
   - Returns the solution as an array of moves

3. **State Conversion**
   - Our cube state uses arrays for corner/edge positions and orientations
   - The bridge converts this to/from CubeJS's internal representation
   - Move notation is compatible between both systems

## Usage

### Solving a Cube

```typescript
import { solveWithCubeJS } from '../lib/cubejs-bridge';
import { createScrambledCube } from '../lib/cubeState';

// Create a scrambled cube
const scrambledCube = createScrambledCube();

// Solve it
const solution = await solveWithCubeJS(scrambledCube);
console.log('Solution:', solution);
```

### Generating a Scramble

```typescript
import { generateScramble } from '../lib/cubejs-bridge';

// Generate a random scramble
const scramble = await generateScramble();
console.log('Scramble:', scramble);
```

### Testing the Integration

The `TestCubeJS` component provides a way to verify the integration:

1. Click the test button in the top-right corner of the application
2. Run the integration tests
3. View the results in both the UI and browser console

## Performance Considerations

- The first solve may take longer as the solver initializes its move tables
- Solutions are typically found in under 100ms for most cases
- The solver finds solutions of 20 moves or fewer in most cases

## Troubleshooting

### Common Issues

1. **Solver not initializing**
   - Ensure `cubejs-bundle.js` is properly loaded in `index.html`
   - Check the browser console for any loading errors

2. **Incorrect solutions**
   - Verify the state conversion in `convertToCubeJS` and `convertFromCubeJS`
   - Check that move definitions match between systems

3. **Performance problems**
   - The solver is single-threaded and may block the UI during solving
   - Consider using a web worker for solving in a background thread

## Future Improvements

- Implement web worker support for background solving
- Add solution optimization to find shorter solutions
- Support for different solving methods
- Add more comprehensive tests for edge cases

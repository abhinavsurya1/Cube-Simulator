// Simple test script to verify move execution
const { createSolvedCube, isSolved } = require('./client/src/lib/cubeState.ts');
const { executeMove } = require('./client/src/lib/cubeLogic.ts');

console.log('Testing move execution...');

// Start with solved cube
let state = createSolvedCube();
console.log('Initial state:', state);

// Apply a sequence that should return to solved state
const testSequence = ["R", "U", "R'", "U'"]; // This should return to solved state after 4 moves
const fullSequence = [...testSequence, ...testSequence, ...testSequence, ...testSequence]; // 16 moves total

for (let i = 0; i < fullSequence.length; i++) {
  const move = fullSequence[i];
  state = executeMove(state, move);
  console.log(`After move ${i + 1} (${move}):`, state);
}

const solved = isSolved(state);
console.log('Final state is solved:', solved);
console.log('Test passed:', solved); 
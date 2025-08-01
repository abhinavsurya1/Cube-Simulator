import { CubeState, createSolvedCube } from './cubeState';
import { MOVE_DEFINITIONS } from './moves';

// Execute a move on the cube state
export function executeMove(state: CubeState, move: string): CubeState {
  const moveData = MOVE_DEFINITIONS[move];
  
  if (!moveData) {
    console.error(`Unknown move: ${move}`);
    return state;
  }

  // Create deep copy
  const newState: CubeState = {
    cornerPositions: [...state.cornerPositions],
    cornerOrientations: [...state.cornerOrientations],
    edgePositions: [...state.edgePositions],
    edgeOrientations: [...state.edgeOrientations]
  };

  // Apply corner cycle - CORRECT WAY
  if (moveData.cornerCycle.length > 0) {
    // Save the pieces that will be moved
    const tempPositions: number[] = [];
    const tempOrientations: number[] = [];
    
    for (const pos of moveData.cornerCycle) {
      tempPositions.push(state.cornerPositions[pos]);
      tempOrientations.push(state.cornerOrientations[pos]);
    }
    
    // Apply the cycle: each position gets the piece from the previous position in cycle
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const currentPos = moveData.cornerCycle[i];
      const prevIndex = (i - 1 + moveData.cornerCycle.length) % moveData.cornerCycle.length;
      
      // Move piece from previous position to current position
      newState.cornerPositions[currentPos] = tempPositions[prevIndex];
      newState.cornerOrientations[currentPos] = 
        (tempOrientations[prevIndex] + (moveData.cornerOrientationChange[i] || 0)) % 3;
    }
  }
  
  // Apply edge cycle - CORRECT WAY
  if (moveData.edgeCycle.length > 0) {
    // Save the pieces that will be moved
    const tempPositions: number[] = [];
    const tempOrientations: number[] = [];
    
    for (const pos of moveData.edgeCycle) {
      tempPositions.push(state.edgePositions[pos]);
      tempOrientations.push(state.edgeOrientations[pos]);
    }
    
    // Apply the cycle: each position gets the piece from the previous position in cycle
    for (let i = 0; i < moveData.edgeCycle.length; i++) {
      const currentPos = moveData.edgeCycle[i];
      const prevIndex = (i - 1 + moveData.edgeCycle.length) % moveData.edgeCycle.length;
      
      // Move piece from previous position to current position
      newState.edgePositions[currentPos] = tempPositions[prevIndex];
      newState.edgeOrientations[currentPos] = 
        (tempOrientations[prevIndex] + (moveData.edgeOrientationChange[i] || 0)) % 2;
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

// Test function to verify move execution is working correctly
export function testMoveExecution(): boolean {
  console.log('Testing move execution...');
  
  // Start with solved cube
  let state = createSolvedCube();
  
  // Apply a sequence that should return to solved state
  const testSequence = ["R", "U", "R'", "U'"]; // This should return to solved state after 4 moves
  const fullSequence = [...testSequence, ...testSequence, ...testSequence, ...testSequence]; // 16 moves total
  
  console.log('Initial state:', state);
  
  for (let i = 0; i < fullSequence.length; i++) {
    const move = fullSequence[i];
    state = executeMove(state, move);
    console.log(`After move ${i + 1} (${move}):`, state);
  }
  
  const isSolved = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  
  console.log('Final state is solved:', isSolved);
  return isSolved;
}

// Comprehensive test to verify move execution works correctly
export function comprehensiveMoveTest(): boolean {
  console.log('=== COMPREHENSIVE MOVE TEST ===');
  
  let allTestsPassed = true;
  
  // Test 1: Basic R U R' U' sequence (should return to solved after 4 moves)
  console.log('\nTest 1: R U R\' U\' sequence');
  let state = createSolvedCube();
  const test1 = ["R", "U", "R'", "U'"];
  for (const move of test1) {
    state = executeMove(state, move);
  }
  const test1Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 1 result:', test1Result);
  if (!test1Result) {
    console.log('Test 1 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test1Result;
  
  // Test 2: R U R' U' repeated 4 times (should definitely be solved)
  console.log('\nTest 2: R U R\' U\' repeated 4 times');
  state = createSolvedCube();
  const test2 = [...test1, ...test1, ...test1, ...test1];
  for (const move of test2) {
    state = executeMove(state, move);
  }
  const test2Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 2 result:', test2Result);
  if (!test2Result) {
    console.log('Test 2 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test2Result;
  
  // Test 3: F R U R' U' F' (Sledgehammer - should return to solved)
  console.log('\nTest 3: F R U R\' U\' F\' (Sledgehammer)');
  state = createSolvedCube();
  const test3 = ["F", "R", "U", "R'", "U'", "F'"];
  for (const move of test3) {
    state = executeMove(state, move);
  }
  const test3Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 3 result:', test3Result);
  if (!test3Result) {
    console.log('Test 3 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test3Result;
  
  // Test 4: U4 should return to solved
  console.log('\nTest 4: U4 should return to solved');
  state = createSolvedCube();
  for (let i = 0; i < 4; i++) {
    state = executeMove(state, 'U');
  }
  const test4Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 4 result:', test4Result);
  if (!test4Result) {
    console.log('Test 4 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test4Result;
  
  // Test 5: F2 F2 should return to solved
  console.log('\nTest 5: F2 F2 should return to solved');
  state = createSolvedCube();
  state = executeMove(state, 'F2');
  state = executeMove(state, 'F2');
  const test5Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 5 result:', test5Result);
  if (!test5Result) {
    console.log('Test 5 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test5Result;
  
  // Test 6: Test the proven solution sequence
  console.log('\nTest 6: Proven solution sequence');
  state = createSolvedCube();
  const provenSequence = [
    "F", "R", "U", "R'", "U'", "F'",
    "R", "U", "R'", "U'",
    "U", "R", "U'", "R'", "U'", "F'", "U", "F",
    "F", "R", "U", "R'", "U'", "F'",
    "R", "U", "R'", "U", "R", "U2", "R'",
    "R'", "F", "R'", "B2", "R", "F'", "R'", "B2", "R2",
    "R2", "U", "R", "U", "R'", "U'", "R'", "U'", "R'", "U", "R'"
  ];
  for (const move of provenSequence) {
    state = executeMove(state, move);
  }
  const test6Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 6 result:', test6Result);
  if (!test6Result) {
    console.log('Test 6 failed! State:', state);
  }
  allTestsPassed = allTestsPassed && test6Result;
  
  console.log('\nAll tests passed:', allTestsPassed);
  return allTestsPassed;
}

// Debug function to show state after each move
export function debugMoveSequence(initialState: CubeState, moves: string[]): void {
  console.log('=== DEBUGGING MOVE SEQUENCE ===');
  console.log('Initial state:', {
    corners: initialState.cornerPositions.join(','),
    cornerOr: initialState.cornerOrientations.join(','),
    edges: initialState.edgePositions.join(','),
    edgeOr: initialState.edgeOrientations.join(',')
  });
  
  let state = { ...initialState };
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    state = executeMove(state, move);
    
    console.log(`After move ${i + 1} (${move}):`, {
      corners: state.cornerPositions.join(','),
      cornerOr: state.cornerOrientations.join(','),
      edges: state.edgePositions.join(','),
      edgeOr: state.edgeOrientations.join(',')
    });
  }
  
  const solved = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('Final state is solved:', solved);
  
  if (!solved) {
    console.log('Incorrect pieces:');
    for (let i = 0; i < 8; i++) {
      if (state.cornerPositions[i] !== i) {
        console.log(`Corner ${i}: expected ${i}, got ${state.cornerPositions[i]}`);
      }
    }
    for (let i = 0; i < 12; i++) {
      if (state.edgePositions[i] !== i) {
        console.log(`Edge ${i}: expected ${i}, got ${state.edgePositions[i]}`);
      }
    }
  }
}

// Test function to verify fixed move execution
export function testFixedMoves(): boolean {
  console.log('=== TESTING FIXED MOVES ===');
  
  let allPassed = true;
  
  // Test 1: R R' should return to solved
  let state = createSolvedCube();
  state = executeMove(state, 'R');
  state = executeMove(state, "R'");
  const test1 = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('R R\' test:', test1);
  allPassed = allPassed && test1;
  
  // Test 2: U4 should return to solved
  state = createSolvedCube();
  for (let i = 0; i < 4; i++) {
    state = executeMove(state, 'U');
  }
  const test2 = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('U4 test:', test2);
  allPassed = allPassed && test2;
  
  // Test 3: F2 F2 should return to solved
  state = createSolvedCube();
  state = executeMove(state, 'F2');
  state = executeMove(state, 'F2');
  const test3 = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('F2 F2 test:', test3);
  allPassed = allPassed && test3;
  
  // Test 4: L L' should return to solved
  state = createSolvedCube();
  state = executeMove(state, 'L');
  state = executeMove(state, "L'");
  const test4 = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('L L\' test:', test4);
  allPassed = allPassed && test4;
  
  // Test 5: Complex sequence should work
  state = createSolvedCube();
  const complexSequence = ["R", "U", "R'", "U'"];
  for (const move of complexSequence) {
    state = executeMove(state, move);
  }
  // Apply the sequence 4 times - should return to solved
  for (let i = 0; i < 3; i++) {
    for (const move of complexSequence) {
      state = executeMove(state, move);
    }
  }
  const test5 = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('Complex sequence test:', test5);
  allPassed = allPassed && test5;
  
  console.log('All tests passed:', allPassed);
  return allPassed;
}

// Step-by-step debug function to see what happens during move execution
export function debugMoveStepByStep(): void {
  console.log('=== STEP-BY-STEP MOVE DEBUG ===');
  
  let state = createSolvedCube();
  console.log('Initial state:', state);
  
  const moves = ["R", "U", "R'", "U'"];
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    console.log(`\n--- Executing move ${i + 1}: ${move} ---`);
    
    const moveData = MOVE_DEFINITIONS[move];
    console.log('Move data:', moveData);
    
    const newState = executeMove(state, move);
    console.log('State after move:', newState);
    
    // Check if the move was valid
    const isValid = newState.cornerPositions.length === 8 && 
                   newState.edgePositions.length === 12 &&
                   newState.cornerOrientations.length === 8 &&
                   newState.edgeOrientations.length === 12;
    
    console.log('Move valid:', isValid);
    
    state = newState;
  }
  
  const finalSolved = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('\nFinal state solved:', finalSolved);
  console.log('Final state:', state);
}

// Simple test to verify basic move execution
export function simpleMoveTest(): boolean {
  console.log('=== SIMPLE MOVE TEST ===');
  
  // Test 1: Single R move
  console.log('Test 1: Single R move');
  let state = createSolvedCube();
  state = executeMove(state, 'R');
  console.log('After R move:', state);
  
  // Test 2: R R' should return to solved
  console.log('Test 2: R R\' sequence');
  state = createSolvedCube();
  state = executeMove(state, 'R');
  state = executeMove(state, "R'");
  const test2Result = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('R R\' test result:', test2Result);
  if (!test2Result) {
    console.log('R R\' test failed! Final state:', state);
  }
  
  // Test 3: U U' should return to solved
  console.log('Test 3: U U\' sequence');
  state = createSolvedCube();
  state = executeMove(state, 'U');
  state = executeMove(state, "U'");
  const test3Result = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('U U\' test result:', test3Result);
  if (!test3Result) {
    console.log('U U\' test failed! Final state:', state);
  }
  
  // Test 4: F F' should return to solved
  console.log('Test 4: F F\' sequence');
  state = createSolvedCube();
  state = executeMove(state, 'F');
  state = executeMove(state, "F'");
  const test4Result = state.cornerPositions.every((pos, i) => pos === i) &&
                 state.cornerOrientations.every(ori => ori === 0) &&
                 state.edgePositions.every((pos, i) => pos === i) &&
                 state.edgeOrientations.every(ori => ori === 0);
  console.log('F F\' test result:', test4Result);
  if (!test4Result) {
    console.log('F F\' test failed! Final state:', state);
  }
  
  const allPassed = test2Result && test3Result && test4Result;
  console.log('All simple tests passed:', allPassed);
  return allPassed;
}

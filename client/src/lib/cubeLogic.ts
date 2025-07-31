import { CubeState, createSolvedCube } from './cubeState';
import { MOVE_DEFINITIONS } from './moves';

// Execute a move on the cube state
export function executeMove(state: CubeState, move: string): CubeState {
  // Create a deep clone of the state to avoid mutating the original
  const newState: CubeState = {
    cornerPositions: [...state.cornerPositions],
    cornerOrientations: [...state.cornerOrientations],
    edgePositions: [...state.edgePositions],
    edgeOrientations: [...state.edgeOrientations]
  };

  const moveData = MOVE_DEFINITIONS[move];
  
  if (!moveData) {
    console.error(`Unknown move: ${move}`);
    return state;
  }

  // Apply corner moves
  if (moveData.cornerCycle && moveData.cornerCycle.length > 0) {
    // Save the first corner's state
    const firstCornerPos = newState.cornerPositions[moveData.cornerCycle[0]];
    const firstCornerOri = newState.cornerOrientations[firstCornerPos];
    
    // Apply the cycle to positions
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const current = moveData.cornerCycle[i];
      const next = moveData.cornerCycle[(i + 1) % moveData.cornerCycle.length];
      
      if (i === moveData.cornerCycle.length - 1) {
        // For the last in cycle, use the first one we saved
        newState.cornerPositions[current] = firstCornerPos;
      } else {
        newState.cornerPositions[current] = newState.cornerPositions[next];
      }
    }
    
    // Apply orientation changes to the pieces that moved
    for (let i = 0; i < moveData.cornerCycle.length; i++) {
      const current = moveData.cornerCycle[i];
      const orientationChange = moveData.cornerOrientationChange[i] || 0;
      // Get the piece that is now at position 'current'
      const piece = newState.cornerPositions[current];
      newState.cornerOrientations[piece] = (newState.cornerOrientations[piece] + orientationChange) % 3;
    }
  }
  
  // Apply edge moves
  if (moveData.edgeCycle && moveData.edgeCycle.length > 0) {
    // Save the first edge's state
    const firstEdgePos = newState.edgePositions[moveData.edgeCycle[0]];
    const firstEdgeOri = newState.edgeOrientations[firstEdgePos];
    
    // Apply the cycle to positions
    for (let i = 0; i < moveData.edgeCycle.length; i++) {
      const current = moveData.edgeCycle[i];
      const next = moveData.edgeCycle[(i + 1) % moveData.edgeCycle.length];
      
      if (i === moveData.edgeCycle.length - 1) {
        // For the last in cycle, use the first one we saved
        newState.edgePositions[current] = firstEdgePos;
      } else {
        newState.edgePositions[current] = newState.edgePositions[next];
      }
    }
    
    // Apply orientation changes to the pieces that moved
    for (let i = 0; i < moveData.edgeCycle.length; i++) {
      const current = moveData.edgeCycle[i];
      const orientationChange = moveData.edgeOrientationChange[i] || 0;
      // Get the piece that is now at position 'current'
      const piece = newState.edgePositions[current];
      newState.edgeOrientations[piece] = (newState.edgeOrientations[piece] + orientationChange) % 2;
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

// Comprehensive test function to verify move execution
export function comprehensiveMoveTest(): boolean {
  console.log('=== COMPREHENSIVE MOVE TEST ===');
  
  // Test 1: R U R' U' (should return to solved after 4 moves)
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
  
  // Test 4: R U R' U' F' U' F (Right trigger - should return to solved)
  console.log('\nTest 4: R U R\' U\' F\' U\' F (Right trigger)');
  state = createSolvedCube();
  const test4 = ["R", "U", "R'", "U'", "F'", "U'", "F"];
  for (const move of test4) {
    state = executeMove(state, move);
  }
  const test4Result = state.cornerPositions.every((pos, i) => pos === i) &&
                   state.cornerOrientations.every(ori => ori === 0) &&
                   state.edgePositions.every((pos, i) => pos === i) &&
                   state.edgeOrientations.every(ori => ori === 0);
  console.log('Test 4 result:', test4Result);
  
  const allTestsPassed = test1Result && test2Result && test3Result && test4Result;
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

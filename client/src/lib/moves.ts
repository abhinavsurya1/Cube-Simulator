// Move definitions for Rubik's Cube
// Each move affects specific corners and edges

export interface MoveDefinition {
  cornerCycle: number[];
  cornerOrientationChange: number[];
  edgeCycle: number[];
  edgeOrientationChange: number[];
}

// Corner and edge numbering:
// Corners: 0-7 (starting from top-front-right, going clockwise when viewed from top)
// Edges: 0-11 (starting from top-front, going clockwise around top, then middle, then bottom)

export const MOVE_DEFINITIONS: { [key: string]: MoveDefinition } = {
  // U face moves (Upper) - No orientation changes for U moves
  'U': {
    cornerCycle: [0, 1, 2, 3],
    cornerOrientationChange: [],
    edgeCycle: [0, 1, 2, 3],
    edgeOrientationChange: []
  },
  "U'": {
    cornerCycle: [3, 2, 1, 0],
    cornerOrientationChange: [],
    edgeCycle: [3, 2, 1, 0],
    edgeOrientationChange: []
  },
  'U2': {
    cornerCycle: [0, 2, 1, 3],
    cornerOrientationChange: [],
    edgeCycle: [0, 2, 1, 3],
    edgeOrientationChange: []
  },
  
  // R face moves (Right) - Corners change orientation when moved
  'R': {
    cornerCycle: [0, 4, 7, 3],
    cornerOrientationChange: [1, 2, 1, 2], // CHANGED: was [0, 1, 2, 1]
    edgeCycle: [1, 5, 9, 4],
    edgeOrientationChange: []
  },
  "R'": {
    cornerCycle: [3, 7, 4, 0],
    cornerOrientationChange: [2, 1, 2, 1], // CHANGED: was [1, 2, 1, 2]
    edgeCycle: [4, 9, 5, 1],
    edgeOrientationChange: []
  },
  'R2': {
    cornerCycle: [0, 7, 4, 3],
    cornerOrientationChange: [],
    edgeCycle: [1, 9, 5, 4],
    edgeOrientationChange: []
  },
  
  // F face moves (Front) - Corners and edges change orientation
  'F': {
    cornerCycle: [3, 7, 6, 2],
    cornerOrientationChange: [1, 2, 1, 2], // 1 = clockwise, 2 = counter-clockwise
    edgeCycle: [2, 6, 10, 7],
    edgeOrientationChange: [1, 1, 1, 1] // Flip all edges
  },
  "F'": {
    cornerCycle: [2, 6, 7, 3],
    cornerOrientationChange: [1, 2, 1, 2], // 1 = clockwise, 2 = counter-clockwise
    edgeCycle: [7, 10, 6, 2],
    edgeOrientationChange: [1, 1, 1, 1] // Flip all edges
  },
  'F2': {
    cornerCycle: [3, 6, 7, 2],
    cornerOrientationChange: [],
    edgeCycle: [2, 10, 6, 7],
    edgeOrientationChange: []
  },
  
  // L face moves (Left) - Corners change orientation when moved
  'L': {
    cornerCycle: [1, 2, 6, 5],
    cornerOrientationChange: [1, 2, 1, 2], // CHANGED: was [2, 1, 2, 1]
    edgeCycle: [3, 7, 11, 8],
    edgeOrientationChange: []
  },
  "L'": {
    cornerCycle: [5, 6, 2, 1],
    cornerOrientationChange: [2, 1, 2, 1], // CHANGED: was [1, 2, 1, 2]
    edgeCycle: [8, 11, 7, 3],
    edgeOrientationChange: []
  },
  'L2': {
    cornerCycle: [1, 6, 2, 5],
    cornerOrientationChange: [],
    edgeCycle: [3, 11, 7, 8],
    edgeOrientationChange: []
  },
  
  // D face moves (Down) - No orientation changes for D moves
  'D': {
    cornerCycle: [4, 5, 6, 7],
    cornerOrientationChange: [],
    edgeCycle: [8, 9, 10, 11],
    edgeOrientationChange: []
  },
  "D'": {
    cornerCycle: [7, 6, 5, 4],
    cornerOrientationChange: [],
    edgeCycle: [11, 10, 9, 8],
    edgeOrientationChange: []
  },
  'D2': {
    cornerCycle: [4, 6, 5, 7],
    cornerOrientationChange: [],
    edgeCycle: [8, 10, 9, 11],
    edgeOrientationChange: []
  },
  
  // B face moves (Back) - Corners and edges change orientation
  'B': {
    cornerCycle: [0, 1, 5, 4],
    cornerOrientationChange: [1, 2, 1, 2], // 1 = clockwise, 2 = counter-clockwise
    edgeCycle: [0, 4, 8, 5],
    edgeOrientationChange: [1, 1, 1, 1] // Flip all edges
  },
  "B'": {
    cornerCycle: [4, 5, 1, 0],
    cornerOrientationChange: [1, 2, 1, 2], // 1 = clockwise, 2 = counter-clockwise
    edgeCycle: [5, 8, 4, 0],
    edgeOrientationChange: [1, 1, 1, 1] // Flip all edges
  },
  'B2': {
    cornerCycle: [0, 5, 1, 4],
    cornerOrientationChange: [],
    edgeCycle: [0, 8, 4, 5],
    edgeOrientationChange: []
  }
};

// NEW: 2x2 Move definitions (only corners, no edges)
export const MOVE_DEFINITIONS_2X2: { [key: string]: MoveDefinition } = {
  // U face moves (Upper) - No orientation changes for U moves
  'U': {
    cornerCycle: [0, 1, 2, 3],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "U'": {
    cornerCycle: [3, 2, 1, 0],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'U2': {
    cornerCycle: [0, 2, 1, 3],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  
  // R face moves (Right) - Corners change orientation when moved
  'R': {
    cornerCycle: [0, 4, 7, 3],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "R'": {
    cornerCycle: [3, 7, 4, 0],
    cornerOrientationChange: [2, 1, 2, 1],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'R2': {
    cornerCycle: [0, 7, 4, 3],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  
  // F face moves (Front) - Corners change orientation
  'F': {
    cornerCycle: [3, 7, 6, 2],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "F'": {
    cornerCycle: [2, 6, 7, 3],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'F2': {
    cornerCycle: [3, 6, 7, 2],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  
  // L face moves (Left) - Corners change orientation when moved
  'L': {
    cornerCycle: [1, 2, 6, 5],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "L'": {
    cornerCycle: [5, 6, 2, 1],
    cornerOrientationChange: [2, 1, 2, 1],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'L2': {
    cornerCycle: [1, 6, 2, 5],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  
  // D face moves (Down) - No orientation changes for D moves
  'D': {
    cornerCycle: [4, 5, 6, 7],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "D'": {
    cornerCycle: [7, 6, 5, 4],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'D2': {
    cornerCycle: [4, 6, 5, 7],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  
  // B face moves (Back) - Corners change orientation
  'B': {
    cornerCycle: [0, 1, 5, 4],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  "B'": {
    cornerCycle: [4, 5, 1, 0],
    cornerOrientationChange: [1, 2, 1, 2],
    edgeCycle: [],
    edgeOrientationChange: []
  },
  'B2': {
    cornerCycle: [0, 5, 1, 4],
    cornerOrientationChange: [],
    edgeCycle: [],
    edgeOrientationChange: []
  }
};

// Test function to verify move definitions
export function testMoveDefinitions(): boolean {
  console.log('=== TESTING MOVE DEFINITIONS ===');
  
  const requiredMoves = [
    'U', "U'", 'U2',
    'R', "R'", 'R2', 
    'F', "F'", 'F2',
    'L', "L'", 'L2',
    'D', "D'", 'D2',
    'B', "B'", 'B2'
  ];
  
  let allDefined = true;
  
  for (const move of requiredMoves) {
    if (!MOVE_DEFINITIONS[move]) {
      console.error(`Missing move definition: ${move}`);
      allDefined = false;
    } else {
      const def = MOVE_DEFINITIONS[move];
      console.log(`${move}:`, {
        cornerCycle: def.cornerCycle,
        cornerOrientationChange: def.cornerOrientationChange,
        edgeCycle: def.edgeCycle,
        edgeOrientationChange: def.edgeOrientationChange
      });
    }
  }
  
  console.log('All moves defined:', allDefined);
  return allDefined;
}

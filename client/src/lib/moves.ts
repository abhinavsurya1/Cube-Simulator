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
  // U face moves (Upper)
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
  
  // R face moves (Right)
  'R': {
    cornerCycle: [0, 4, 7, 3],
    cornerOrientationChange: [0, 4, 7, 3],
    edgeCycle: [1, 5, 9, 4],
    edgeOrientationChange: []
  },
  "R'": {
    cornerCycle: [3, 7, 4, 0],
    cornerOrientationChange: [3, 7, 4, 0],
    edgeCycle: [4, 9, 5, 1],
    edgeOrientationChange: []
  },
  'R2': {
    cornerCycle: [0, 7, 4, 3],
    cornerOrientationChange: [],
    edgeCycle: [1, 9, 5, 4],
    edgeOrientationChange: []
  },
  
  // F face moves (Front)
  'F': {
    cornerCycle: [3, 7, 6, 2],
    cornerOrientationChange: [3, 7, 6, 2],
    edgeCycle: [2, 6, 10, 7],
    edgeOrientationChange: [2, 6, 10, 7]
  },
  "F'": {
    cornerCycle: [2, 6, 7, 3],
    cornerOrientationChange: [2, 6, 7, 3],
    edgeCycle: [7, 10, 6, 2],
    edgeOrientationChange: [7, 10, 6, 2]
  },
  'F2': {
    cornerCycle: [3, 6, 7, 2],
    cornerOrientationChange: [],
    edgeCycle: [2, 10, 6, 7],
    edgeOrientationChange: []
  },
  
  // L face moves (Left)
  'L': {
    cornerCycle: [1, 2, 6, 5],
    cornerOrientationChange: [1, 2, 6, 5],
    edgeCycle: [3, 7, 11, 8],
    edgeOrientationChange: []
  },
  "L'": {
    cornerCycle: [5, 6, 2, 1],
    cornerOrientationChange: [5, 6, 2, 1],
    edgeCycle: [8, 11, 7, 3],
    edgeOrientationChange: []
  },
  'L2': {
    cornerCycle: [1, 6, 2, 5],
    cornerOrientationChange: [],
    edgeCycle: [3, 11, 7, 8],
    edgeOrientationChange: []
  },
  
  // D face moves (Down)
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
  
  // B face moves (Back)
  'B': {
    cornerCycle: [0, 1, 5, 4],
    cornerOrientationChange: [0, 1, 5, 4],
    edgeCycle: [0, 4, 8, 5],
    edgeOrientationChange: [0, 4, 8, 5]
  },
  "B'": {
    cornerCycle: [4, 5, 1, 0],
    cornerOrientationChange: [4, 5, 1, 0],
    edgeCycle: [5, 8, 4, 0],
    edgeOrientationChange: [5, 8, 4, 0]
  },
  'B2': {
    cornerCycle: [0, 5, 1, 4],
    cornerOrientationChange: [],
    edgeCycle: [0, 8, 4, 5],
    edgeOrientationChange: []
  }
};

// Visual representation of the Rubik's Cube
// This handles the 3D position and color state of each cubie

export interface CubieState {
  position: [number, number, number]; // 3D position
  faceColors: {
    right?: string;   // +X face
    left?: string;    // -X face
    top?: string;     // +Y face
    bottom?: string;  // -Y face
    front?: string;   // +Z face
    back?: string;    // -Z face
  };
}

// Colors for each face
export const FACE_COLORS = {
  U: '#ffffff', // white (Up)
  D: '#ffff00', // yellow (Down)
  F: '#00ff00', // green (Front)
  B: '#0000ff', // blue (Back)
  L: '#ff0000', // red (Left)
  R: '#ff8000'  // orange (Right)
};

// Create initial solved cube state
export function createVisualCube(): CubieState[] {
  const cubies: CubieState[] = [];
  
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip center cubie
        if (x === 0 && y === 0 && z === 0) continue;
        
        const position: [number, number, number] = [x, y, z];
        
        // Initialize all face colors - use undefined for interior faces
        const faceColors: any = {
          right: undefined,
          left: undefined,
          top: undefined,
          bottom: undefined,
          front: undefined,
          back: undefined
        };
        
        // Assign colors only to visible faces based on position
        if (x === 1) faceColors.right = FACE_COLORS.R;   // Right face
        if (x === -1) faceColors.left = FACE_COLORS.L;   // Left face
        if (y === 1) faceColors.top = FACE_COLORS.U;     // Top face
        if (y === -1) faceColors.bottom = FACE_COLORS.D; // Bottom face
        if (z === 1) faceColors.front = FACE_COLORS.F;   // Front face
        if (z === -1) faceColors.back = FACE_COLORS.B;   // Back face
        
        cubies.push({ position, faceColors });
      }
    }
  }
  
  return cubies;
}

// Apply a face rotation to the visual cube
export function applyVisualMove(cubies: CubieState[], move: string): CubieState[] {
  console.log(`Applying visual move: ${move}`);
  
  const newCubies = cubies.map(cubie => ({
    position: [...cubie.position] as [number, number, number],
    faceColors: { ...cubie.faceColors }
  }));
  
  switch (move) {
    case 'U':
      return rotateU(newCubies, 1);
    case "U'":
      return rotateU(newCubies, -1);
    case 'U2':
      return rotateU(rotateU(newCubies, 1), 1);
    case 'D':
      return rotateD(newCubies, 1);
    case "D'":
      return rotateD(newCubies, -1);
    case 'D2':
      return rotateD(rotateD(newCubies, 1), 1);
    case 'R':
      return rotateR(newCubies, 1);
    case "R'":
      return rotateR(newCubies, -1);
    case 'R2':
      return rotateR(rotateR(newCubies, 1), 1);
    case 'L':
      return rotateL(newCubies, 1);
    case "L'":
      return rotateL(newCubies, -1);
    case 'L2':
      return rotateL(rotateL(newCubies, 1), 1);
    case 'F':
      return rotateF(newCubies, 1);
    case "F'":
      return rotateF(newCubies, -1);
    case 'F2':
      return rotateF(rotateF(newCubies, 1), 1);
    case 'B':
      return rotateB(newCubies, 1);
    case "B'":
      return rotateB(newCubies, -1);
    case 'B2':
      return rotateB(rotateB(newCubies, 1), 1);
    default:
      console.warn(`Unknown move: ${move}`);
      return newCubies;
  }
}

// Rotate U face (y = 1)
function rotateU(cubies: CubieState[], direction: number): CubieState[] {
  const upperFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[1] === 1) {
      upperFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedUpperCubies = upperFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around Y axis
    const newX = direction === 1 ? -z : z;
    const newZ = direction === 1 ? x : -x;
    
    // Rotate face colors for the side faces that touch this cubie
    const newFaceColors = { ...cubie.faceColors };
    
    if (direction === 1) {
      // U clockwise: position (x,z) -> (-z,x)
      // This means: front->right, right->back, back->left, left->front
      const temp = newFaceColors.front;
      newFaceColors.front = newFaceColors.right;
      newFaceColors.right = newFaceColors.back;
      newFaceColors.back = newFaceColors.left;
      newFaceColors.left = temp;
    } else {
      // U counter-clockwise: opposite direction
      const temp = newFaceColors.front;
      newFaceColors.front = newFaceColors.left;
      newFaceColors.left = newFaceColors.back;
      newFaceColors.back = newFaceColors.right;
      newFaceColors.right = temp;
    }
    
    return {
      position: [newX, y, newZ] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedUpperCubies];
}

// Rotate D face (y = -1)
function rotateD(cubies: CubieState[], direction: number): CubieState[] {
  const lowerFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[1] === -1) {
      lowerFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedLowerCubies = lowerFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around Y axis (same direction as U but for bottom face)
    const newX = direction === 1 ? z : -z;
    const newZ = direction === 1 ? -x : x;
    
    // Rotate face colors for the side faces that touch this cubie
    const newFaceColors = { ...cubie.faceColors };
    
    if (direction === 1) {
      // D clockwise: position (x,z) -> (z,-x) 
      // This means: front->left, left->back, back->right, right->front
      const temp = newFaceColors.front;
      newFaceColors.front = newFaceColors.left;
      newFaceColors.left = newFaceColors.back;
      newFaceColors.back = newFaceColors.right;
      newFaceColors.right = temp;
    } else {
      // D counter-clockwise: opposite direction
      const temp = newFaceColors.front;
      newFaceColors.front = newFaceColors.right;
      newFaceColors.right = newFaceColors.back;
      newFaceColors.back = newFaceColors.left;
      newFaceColors.left = temp;
    }
    
    return {
      position: [newX, y, newZ] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedLowerCubies];
}

// Rotate R face (x = 1)
function rotateR(cubies: CubieState[], direction: number): CubieState[] {
  const rightFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[0] === 1) {
      rightFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedRightCubies = rightFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around X axis
    const newY = direction === 1 ? z : -z;
    const newZ = direction === 1 ? -y : y;
    
    // Rotate face colors around the right face
    const newFaceColors = { ...cubie.faceColors };
    if (direction === 1) {
      // Clockwise: top->front->bottom->back->top
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.front;
      newFaceColors.front = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.back;
      newFaceColors.back = temp;
    } else {
      // Counter-clockwise: top->back->bottom->front->top
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.back;
      newFaceColors.back = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.front;
      newFaceColors.front = temp;
    }
    
    return {
      position: [x, newY, newZ] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedRightCubies];
}

// Rotate L face (x = -1)
function rotateL(cubies: CubieState[], direction: number): CubieState[] {
  const leftFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[0] === -1) {
      leftFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedLeftCubies = leftFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around X axis (opposite of R)
    const newY = direction === 1 ? -z : z;
    const newZ = direction === 1 ? y : -y;
    
    // Rotate face colors around the left face
    const newFaceColors = { ...cubie.faceColors };
    if (direction === 1) {
      // Clockwise: top->back->bottom->front->top (opposite of R)
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.back;
      newFaceColors.back = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.front;
      newFaceColors.front = temp;
    } else {
      // Counter-clockwise
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.front;
      newFaceColors.front = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.back;
      newFaceColors.back = temp;
    }
    
    return {
      position: [x, newY, newZ] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedLeftCubies];
}

// Rotate F face (z = 1)
function rotateF(cubies: CubieState[], direction: number): CubieState[] {
  const frontFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[2] === 1) {
      frontFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedFrontCubies = frontFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around Z axis
    const newX = direction === 1 ? y : -y;
    const newY = direction === 1 ? -x : x;
    
    // Rotate face colors around the front face
    const newFaceColors = { ...cubie.faceColors };
    if (direction === 1) {
      // Clockwise: top->left->bottom->right->top
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.left;
      newFaceColors.left = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.right;
      newFaceColors.right = temp;
    } else {
      // Counter-clockwise
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.right;
      newFaceColors.right = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.left;
      newFaceColors.left = temp;
    }
    
    return {
      position: [newX, newY, z] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedFrontCubies];
}

// Rotate B face (z = -1)
function rotateB(cubies: CubieState[], direction: number): CubieState[] {
  const backFaceCubies: CubieState[] = [];
  const otherCubies: CubieState[] = [];
  
  cubies.forEach(cubie => {
    if (cubie.position[2] === -1) {
      backFaceCubies.push(cubie);
    } else {
      otherCubies.push(cubie);
    }
  });
  
  const rotatedBackCubies = backFaceCubies.map(cubie => {
    const [x, y, z] = cubie.position;
    
    // Rotate position around Z axis (opposite of F)
    const newX = direction === 1 ? -y : y;
    const newY = direction === 1 ? x : -x;
    
    // Rotate face colors around the back face
    const newFaceColors = { ...cubie.faceColors };
    if (direction === 1) {
      // Clockwise: top->right->bottom->left->top (opposite of F)
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.right;
      newFaceColors.right = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.left;
      newFaceColors.left = temp;
    } else {
      // Counter-clockwise
      const temp = newFaceColors.top;
      newFaceColors.top = newFaceColors.left;
      newFaceColors.left = newFaceColors.bottom;
      newFaceColors.bottom = newFaceColors.right;
      newFaceColors.right = temp;
    }
    
    return {
      position: [newX, newY, z] as [number, number, number],
      faceColors: newFaceColors
    };
  });
  
  return [...otherCubies, ...rotatedBackCubies];
}
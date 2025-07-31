import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCube } from '../lib/stores/useCube';
import { useAudio } from '../lib/stores/useAudio';

const CUBIE_SIZE = 0.95;
const CUBIE_GAP = 0.05;

interface CubieProps {
  position: [number, number, number];
  faceColors: { [key: string]: string };
  id: string;
}

function Cubie({ position, faceColors, id }: CubieProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create materials for each face based on the actual cube state
  const materials = [
    new THREE.MeshLambertMaterial({ color: faceColors.right || '#333333' }),   // +X right
    new THREE.MeshLambertMaterial({ color: faceColors.left || '#333333' }),    // -X left
    new THREE.MeshLambertMaterial({ color: faceColors.top || '#333333' }),     // +Y top
    new THREE.MeshLambertMaterial({ color: faceColors.bottom || '#333333' }),  // -Y bottom
    new THREE.MeshLambertMaterial({ color: faceColors.front || '#333333' }),   // +Z front
    new THREE.MeshLambertMaterial({ color: faceColors.back || '#333333' }),    // -Z back
  ];

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
      {materials.map((material, index) => (
        <primitive key={`${id}-${index}`} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
}

export default function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const { 
    visualCube,
    isAnimating, 
    executeMove, 
    scrambleCube, 
    solveCube,
    animationProgress,
    currentMove 
  } = useCube();
  const { playHit } = useAudio();

  // Keyboard controls
  const [, getKeys] = useKeyboardControls();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAnimating) return;

      const key = event.key.toLowerCase();
      const isShift = event.shiftKey;
      
      console.log(`Key pressed: ${key}, Shift: ${isShift}`);

      let move = '';
      switch (key) {
        case 'u': move = isShift ? "U'" : 'U'; break;
        case 'r': move = isShift ? "R'" : 'R'; break;
        case 'f': move = isShift ? "F'" : 'F'; break;
        case 'l': move = isShift ? "L'" : 'L'; break;
        case 'd': move = isShift ? "D'" : 'D'; break;
        case 'b': move = isShift ? "B'" : 'B'; break;
        case ' ': scrambleCube(); return;
        case 'enter': solveCube(); return;
      }

      if (move) {
        console.log(`Executing move: ${move}`);
        executeMove(move);
        playHit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, executeMove, scrambleCube, solveCube, playHit]);

  // Animation frame
  useFrame(() => {
    if (groupRef.current && isAnimating && currentMove) {
      // Apply rotation animation based on progress
      const angle = animationProgress * Math.PI / 2; // 90 degrees
      const isReverse = currentMove.includes("'");
      const finalAngle = isReverse ? -angle : angle;
      
      // Apply rotation to the entire group (simplified animation)
      switch (currentMove.charAt(0)) {
        case 'U':
          groupRef.current.rotation.y = finalAngle;
          break;
        case 'D':
          groupRef.current.rotation.y = -finalAngle;
          break;
        case 'R':
          groupRef.current.rotation.x = finalAngle;
          break;
        case 'L':
          groupRef.current.rotation.x = -finalAngle;
          break;
        case 'F':
          groupRef.current.rotation.z = finalAngle;
          break;
        case 'B':
          groupRef.current.rotation.z = -finalAngle;
          break;
      }
    } else if (groupRef.current && !isAnimating) {
      // Reset rotation when not animating
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  // Generate cubies based on visual cube state
  const generateCubies = () => {
    return visualCube.map((cubie, index) => {
      const [x, y, z] = cubie.position;
      const position: [number, number, number] = [
        x * (CUBIE_SIZE + CUBIE_GAP),
        y * (CUBIE_SIZE + CUBIE_GAP),
        z * (CUBIE_SIZE + CUBIE_GAP)
      ];
      
      return (
        <Cubie 
          key={`cubie-${index}`}
          position={position} 
          faceColors={cubie.faceColors}
          id={`cubie-${index}`}
        />
      );
    });
  };

  return (
    <group ref={groupRef}>
      {generateCubies()}
    </group>
  );
}

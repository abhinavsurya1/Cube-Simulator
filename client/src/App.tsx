import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Import our game components
import RubiksCube from "./components/RubiksCube";
import CubeControls from "./components/CubeControls";
import GameTimer from "./components/GameTimer";
import MoveCounter from "./components/MoveCounter";
import SolverProgress from "./components/SolverProgress";
import ErrorDisplay from "./components/ErrorDisplay";
import TestCubeJS from "./components/TestCubeJS";

// Define control keys for the cube
const controls = [
  { name: "U", keys: ["KeyU"] },
  { name: "U'", keys: ["ShiftLeft+KeyU", "ShiftRight+KeyU"] },
  { name: "R", keys: ["KeyR"] },
  { name: "R'", keys: ["ShiftLeft+KeyR", "ShiftRight+KeyR"] },
  { name: "F", keys: ["KeyF"] },
  { name: "F'", keys: ["ShiftLeft+KeyF", "ShiftRight+KeyF"] },
  { name: "L", keys: ["KeyL"] },
  { name: "L'", keys: ["ShiftLeft+KeyL", "ShiftRight+KeyL"] },
  { name: "D", keys: ["KeyD"] },
  { name: "D'", keys: ["ShiftLeft+KeyD", "ShiftRight+KeyD"] },
  { name: "B", keys: ["KeyB"] },
  { name: "B'", keys: ["ShiftLeft+KeyB", "ShiftRight+KeyB"] },
  { name: "scramble", keys: ["Space"] },
  { name: "solve", keys: ["Enter"] },
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {/* UI Overlay */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            pointerEvents: 'none',
            zIndex: 1000
          }}>
            {/* Top HUD */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pointerEvents: 'auto'
            }}>
              <GameTimer />
              <SolverProgress />
              <MoveCounter />
            </div>
            
            {/* Error Display */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto'
            }}>
              <ErrorDisplay />
            </div>
            
            {/* Bottom Controls */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto'
            }}>
              <CubeControls />
            </div>
          </div>

          {/* 3D Scene */}
          <Canvas
            shadows
            camera={{
              position: [5, 5, 5],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#1a1a1a"]} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {/* Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI}
              minDistance={3}
              maxDistance={15}
            />

            <Suspense fallback={null}>
              <RubiksCube />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;

# 🎯 Rubik's Cube Simulator

**Live Demo:** [https://cube-simulator.vercel.app](https://cube-simulator.vercel.app)

A sophisticated 3D Rubik's Cube simulator built with React, TypeScript, and Three.js. Features interactive solving, real-time visualization, and advanced algorithmic capabilities.

## 🚀 Features

- **Interactive 3D Cube**: Real-time manipulation with smooth animations
- **Multi-Cube Support**: 2x2 and 3x3 cube implementations
- **Advanced Solving**: Kociemba Two-Phase Algorithm integration
- **Keyboard Controls**: Full keyboard support for all moves
- **Audio Feedback**: Immersive sound effects for interactions
- **Timer & Statistics**: Speedcubing timer with move counting
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, dark theme with intuitive controls

## 🏗️ Architecture

### File Structure
```
Cube-Simulator/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── RubiksCube.tsx     # 3D cube rendering
│   │   │   ├── CubeControls.tsx   # Interactive controls
│   │   │   ├── GameTimer.tsx      # Speedcubing timer
│   │   │   └── ui/                # Reusable UI components
│   │   ├── lib/                   # Core logic and algorithms
│   │   │   ├── cubeState.ts       # State management
│   │   │   ├── cubeLogic.ts       # Move execution engine
│   │   │   ├── moves.ts           # Move definitions
│   │   │   ├── kociemba.ts        # Two-phase algorithm
│   │   │   └── stores/            # Zustand state stores
│   │   └── main.tsx               # Application entry point
│   └── public/                    # Static assets
├── server/                         # Express.js backend
├── shared/                         # Shared TypeScript types
└── docs/                          # Documentation
```

## 🧠 Algorithm Implementation

### Kociemba Two-Phase Algorithm

Our implementation uses the mathematically proven Kociemba Two-Phase Algorithm for optimal cube solving:

#### Phase 1: Orientation (G0 → G1)
```typescript
// Orient all corners and edges to subgroup G1
const phase1Solution = await idaStar(state, 1);
```

**Goals:**
- All corners oriented correctly (0, 1, or 2 twists)
- All edges oriented correctly (0 or 1 flip)
- E-slice edges in E-slice positions

#### Phase 2: Permutation (G1 → G0)
```typescript
// Permute all pieces to solved state
const phase2Solution = await idaStar(currentState, 2);
```

**Goals:**
- All corners in correct positions
- All edges in correct positions
- Cube fully solved

### State Representation

We use an efficient array-based representation:

```typescript
interface CubeState {
  cornerPositions: number[];    // 8 corners (0-7)
  cornerOrientations: number[]; // 3 orientations per corner
  edgePositions: number[];      // 12 edges (0-11)
  edgeOrientations: number[];   // 2 orientations per edge
  size: 2 | 3;                 // Cube size
}
```

### Move Engine

Pre-computed move definitions ensure O(1) move execution:

```typescript
interface MoveDefinition {
  cornerCycle: number[];           // Corner permutation cycle
  cornerOrientationChange: number[]; // Corner orientation changes
  edgeCycle: number[];             // Edge permutation cycle
  edgeOrientationChange: number[]; // Edge orientation changes
}
```

## 🔧 Technical Stack

### Frontend
- **React 18** - Modern component architecture
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and rendering
- **React Three Fiber** - React integration for Three.js
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

### Backend
- **Express.js** - API server
- **Node.js** - Runtime environment
- **TypeScript** - Full-stack type safety

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - High-performance bundling
- **Jest** - Testing framework
- **Prettier** - Code formatting

## 🎮 Usage

### Keyboard Controls
- **U, R, F, L, D, B** - Clockwise face rotations
- **Shift + U/R/F/L/D/B** - Counter-clockwise rotations
- **Space** - Scramble cube
- **Enter** - Solve cube
- **Mouse** - Orbit camera around cube

### Features
1. **Interactive Solving**: Click solve button or press Enter
2. **Manual Control**: Use keyboard for precise moves
3. **Scrambling**: Generate random positions
4. **Timer**: Track solve times
5. **Move Counter**: Monitor solution length
6. **Audio**: Immersive sound effects

## 🚀 Performance

### Algorithm Efficiency
- **Move Execution**: O(1) constant time
- **State Validation**: O(n) linear time
- **Solution Search**: O(b^d) with heavy pruning
- **Memory Usage**: O(n + s) linear space

### Optimization Techniques
1. **Iterative Deepening A* (IDA*)**: Memory-efficient search
2. **Transposition Tables**: Avoid state revisitation
3. **Move Ordering**: Prioritize promising moves
4. **Heuristic Pruning**: Cut unpromising branches
5. **Phase Separation**: Reduce search complexity

### Solution Quality
- **Average Length**: 20-30 moves
- **Worst Case**: 35 moves (God's number)
- **Guaranteed**: Always finds a solution
- **Optimality**: Near-optimal solutions

## 🎯 Code Versatility

### Multi-Cube Support
Our architecture seamlessly supports different cube sizes:

```typescript
// 2x2 Cube (corners only)
const cube2x2 = createSolved2x2Cube();

// 3x3 Cube (corners + edges)
const cube3x3 = createSolvedCube();
```

### Extensible Move System
Easy to add new moves or cube variants:

```typescript
// Add new move definition
MOVE_DEFINITIONS['X'] = {
  cornerCycle: [0, 1, 2, 3],
  cornerOrientationChange: [1, 1, 1, 1],
  edgeCycle: [0, 1, 2, 3],
  edgeOrientationChange: [1, 1, 1, 1]
};
```

### Modular Architecture
Clean separation of concerns enables easy extension:

- **State Layer**: Pure state management
- **Logic Layer**: Move execution and solving
- **Visual Layer**: 3D rendering and UI
- **Data Layer**: Move definitions and constants

### Algorithm Flexibility
Support for multiple solving approaches:

```typescript
// Kociemba Two-Phase (current)
const solution = await solveCube(state);

// Future: CFOP, Roux, ZZ methods
const cfopSolution = await solveCFOP(state);
const rouxSolution = await solveRoux(state);
```

## 🧪 Testing

Comprehensive test suite ensures algorithm correctness:

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Test Coverage
- **Move Execution**: Verify all moves work correctly
- **State Validation**: Ensure physical constraints
- **Algorithm Correctness**: Validate solutions
- **Performance**: Benchmark solving speed

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Vercel auto-deploys from GitHub
```

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

## 📈 Future Enhancements

### Planned Features
- **4x4, 5x5 Support**: Larger cube variants
- **Pyraminx, Megaminx**: Different puzzle types
- **Speedcubing Timer**: WCA-compliant timing
- **Session Statistics**: Personal records and averages
- **Mobile Touch Controls**: Gesture-based manipulation
- **VR Support**: Immersive virtual reality experience

### Algorithm Improvements
- **Machine Learning**: AI-powered move prediction
- **Pattern Recognition**: Optimal case identification
- **Custom Algorithms**: User-defined solving methods
- **Performance Optimization**: Faster search algorithms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Herbert Kociemba** - Two-Phase Algorithm
- **Three.js Community** - 3D Graphics Library
- **React Team** - Component Framework
- **Speedcubing Community** - Algorithm inspiration

---

**Built with ❤️ using modern web technologies** 
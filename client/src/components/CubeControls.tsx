import { useCube } from '../lib/stores/useCube';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shuffle, Play, RotateCcw, Pause, TestTube } from 'lucide-react';
import { testCubeJSIntegration, testCubeJSLoading, convertToCubeJS } from '../lib/cubejs-bridge';
import { createSolvedCube, isSolved } from '../lib/cubeState';
import { executeMove } from '../lib/cubeLogic';

export default function CubeControls() {
  const { 
    scrambleCube, 
    solveCube, 
    resetCube, 
    isAnimating, 
    isSolving,
    pauseSolving,
    resumeSolving,
    isPaused
  } = useCube();

  return (
    <Card className="bg-black/80 border-gray-600">
      <CardContent className="p-4">
        <div className="flex gap-2 items-center">
          <Button
            onClick={scrambleCube}
            disabled={isAnimating}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Scramble
          </Button>
          
          <Button
            onClick={isSolving ? (isPaused ? resumeSolving : pauseSolving) : solveCube}
            disabled={isAnimating && !isSolving}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            {isSolving ? (
              isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Solve
              </>
            )}
          </Button>
          
          <Button
            onClick={resetCube}
            disabled={isAnimating}
            className="bg-gray-600 hover:bg-gray-700"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-300 text-center">
          <div>Keyboard: U R F L D B (+ Shift for reverse)</div>
          <div>Space: Scramble | Enter: Solve</div>
        </div>
        
        <div className="mt-2 flex justify-center gap-2">
          <Button
            onClick={async () => {
              console.log('=== TESTING CUBEJS ===');
              const loadingTest = testCubeJSLoading();
              console.log('Loading test result:', loadingTest);
              if (loadingTest) {
                const integrationTest = await testCubeJSIntegration();
                console.log('Integration test result:', integrationTest);
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Test CubeJS
          </Button>
          
          <Button
            onClick={async () => {
              console.log('=== TESTING INDIVIDUAL MOVES ===');
              
              const moves = ['U', 'R', 'F', 'L', 'D', 'B'];
              const testSequences = [
                ['U', "U'"], // Should return to solved
                ['R', "R'"], // Should return to solved  
                ['F', "F'"], // Should return to solved
                ['L', "L'"], // Should return to solved
                ['D', "D'"], // Should return to solved
                ['B', "B'"]  // Should return to solved
              ];
              
              for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                const sequence = testSequences[i];
                
                console.log(`\n--- Testing ${move} moves ---`);
                
                // Test with our system
                let ourState = createSolvedCube();
                console.log(`Initial state solved: ${isSolved(ourState)}`);
                
                for (const testMove of sequence) {
                  ourState = executeMove(ourState, testMove);
                }
                
                const ourResult = isSolved(ourState);
                console.log(`Our system after ${sequence.join(' ')}: ${ourResult}`);
                
                // Test with CubeJS
                const cubejsCube = new window.Cube();
                for (const testMove of sequence) {
                  cubejsCube.move(testMove);
                }
                
                const cubejsResult = cubejsCube.isSolved();
                console.log(`CubeJS after ${sequence.join(' ')}: ${cubejsResult}`);
                
                if (ourResult !== cubejsResult) {
                  console.error(`❌ MISMATCH for ${move} moves!`);
                } else {
                  console.log(`✅ ${move} moves work correctly`);
                }
              }
              
              console.log('=== INDIVIDUAL MOVE TEST COMPLETE ===');
            }}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Test Moves
          </Button>

          <Button
            onClick={async () => {
              console.log('=== TESTING ALL MOVES COMPREHENSIVELY ===');
              
              const moves = ['U', 'R', 'F', 'L', 'D', 'B'];
              const testSequences = [
                ['U', "U'"], // Should return to solved
                ['R', "R'"], // Should return to solved  
                ['F', "F'"], // Should return to solved
                ['L', "L'"], // Should return to solved
                ['D', "D'"], // Should return to solved
                ['B', "B'"]  // Should return to solved
              ];
              
              const results = [];
              
              for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                const sequence = testSequences[i];
                
                console.log(`\n--- Testing ${move} moves ---`);
                
                // Test with our system
                let ourState = createSolvedCube();
                
                for (const testMove of sequence) {
                  ourState = executeMove(ourState, testMove);
                }
                
                const ourResult = isSolved(ourState);
                console.log(`Our system after ${sequence.join(' ')}: ${ourResult}`);
                
                // Test with CubeJS
                const cubejsCube = new window.Cube();
                for (const testMove of sequence) {
                  cubejsCube.move(testMove);
                }
                
                const cubejsResult = cubejsCube.isSolved();
                console.log(`CubeJS after ${sequence.join(' ')}: ${cubejsResult}`);
                
                const isWorking = ourResult === cubejsResult;
                results.push({ move, isWorking, ourResult, cubejsResult });
                
                if (!isWorking) {
                  console.error(`❌ MISMATCH for ${move} moves!`);
                } else {
                  console.log(`✅ ${move} moves work correctly`);
                }
              }
              
              // Summary
              console.log('\n=== SUMMARY ===');
              const workingMoves = results.filter(r => r.isWorking).map(r => r.move);
              const brokenMoves = results.filter(r => !r.isWorking).map(r => r.move);
              
              console.log('✅ Working moves:', workingMoves.join(', '));
              console.log('❌ Broken moves:', brokenMoves.join(', '));
              
              if (brokenMoves.length > 0) {
                console.log('\n🔧 Need to fix move definitions for:', brokenMoves.join(', '));
              }
              
              console.log('=== COMPREHENSIVE TEST COMPLETE ===');
            }}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Test All Moves
          </Button>

          <Button
            onClick={async () => {
              console.log('=== COMPREHENSIVE SOLVING TEST ===');
              
              // Test 1: Check if CubeJS is loaded
              console.log('1. Testing CubeJS availability...');
              const loadingTest = testCubeJSLoading();
              console.log('CubeJS loading test result:', loadingTest);
              
              if (!loadingTest) {
                console.error('CubeJS not available!');
                return;
              }
              
              // Test 2: Create a simple scramble and solve it
              console.log('2. Testing simple scramble and solve...');
              const testCube = new window.Cube();
              testCube.move("R U R' U'");
              console.log('Scrambled cube is solved?', testCube.isSolved());
              
              const solution = testCube.solve();
              console.log('CubeJS solution:', solution);
              
              // Test 3: Apply the solution
              console.log('3. Testing solution application...');
              testCube.move(solution);
              console.log('After applying solution, is solved?', testCube.isSolved());
              
              // Test 4: Test our state conversion
              console.log('4. Testing state conversion...');
              const ourState = createSolvedCube();
              const convertedState = convertToCubeJS(ourState);
              const testCube2 = new window.Cube(convertedState);
              console.log('Our solved state converted to CubeJS:', testCube2.isSolved());
              
              // Test 5: Test move application with our system
              console.log('5. Testing move application with our system...');
              let ourState2 = createSolvedCube();
              ourState2 = executeMove(ourState2, "R");
              ourState2 = executeMove(ourState2, "U");
              ourState2 = executeMove(ourState2, "R'");
              ourState2 = executeMove(ourState2, "U'");
              console.log('Our system after R U R\' U\':', isSolved(ourState2));
              
              // Test 6: Test move application with CubeJS
              console.log('6. Testing move application with CubeJS...');
              const cubejsCube3 = new window.Cube();
              cubejsCube3.move("R U R' U'");
              console.log('CubeJS after R U R\' U\':', cubejsCube3.isSolved());
              
              console.log('=== COMPREHENSIVE TEST COMPLETE ===');
            }}
            className="bg-red-600 hover:bg-red-700"
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Full Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

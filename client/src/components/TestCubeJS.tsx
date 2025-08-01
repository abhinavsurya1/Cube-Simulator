import { useEffect, useState } from 'react';
import { useCube } from '../lib/stores/useCube';
import { createSolvedCube, isSolved } from '../lib/cubeState';
import { executeMove as performMove } from '../lib/cubeLogic';

export default function TestCubeJS() {
  const { solveCube, executeMove } = useCube();
  const [testResults, setTestResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (test: string, passed: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, passed, message }]);
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${test}: ${message}`);
  };

  const resetTestResults = () => {
    setTestResults([]);
  };

  const runTests = async () => {
    resetTestResults();
    setIsTesting(true);
    
    try {
      // Test 1: Verify cubejs is loaded
      if (typeof window !== 'undefined' && window.Cube) {
        addTestResult('CubeJS Loaded', true, 'CubeJS library is available on window.Cube');
      } else {
        addTestResult('CubeJS Loaded', false, 'CubeJS library not found on window.Cube');
        setIsTesting(false);
        return;
      }

      // Test 2: Solve a simple scramble
      try {
        // Create a simple scramble (R U R' U')
        const scrambleMoves = ["R", "U", "R'", "U'"];
        let testState = createSolvedCube();
        
        // Apply the scramble
        for (const move of scrambleMoves) {
          testState = performMove(testState, move);
        }
        
        // Check if the scramble worked
        if (!isSolved(testState)) {
          addTestResult('Scramble Test', true, 'Successfully scrambled the cube');
          
          // Try to solve it
          const solution = await window.Cube.asyncSolve(testState);
          if (solution && solution.length > 0) {
            addTestResult('Solver Test', true, `Found solution: ${solution}`);
            
            // Apply the solution
            let finalState = { ...testState };
            for (const move of solution.split(' ')) {
              finalState = performMove(finalState, move);
            }
            
            // Check if the cube is solved
            if (isSolved(finalState)) {
              addTestResult('Solution Test', true, 'Successfully solved the cube');
            } else {
              addTestResult('Solution Test', false, 'Solution did not solve the cube');
            }
          } else {
            addTestResult('Solver Test', false, 'No solution found');
          }
        } else {
          addTestResult('Scramble Test', false, 'Failed to scramble the cube');
        }
      } catch (error) {
        addTestResult('Solver Test', false, `Error during solve: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Test 3: Test the UI integration
      try {
        // This will test the actual UI integration
        await solveCube();
        // If we get here without errors, the UI integration is working
        addTestResult('UI Integration', true, 'Successfully triggered solve from UI');
      } catch (error) {
        addTestResult('UI Integration', false, `Error in UI integration: ${error instanceof Error ? error.message : String(error)}`);
      }
      
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-white mb-4">CubeJS Integration Tests</h2>
      
      <div className="mb-4">
        <button
          onClick={runTests}
          disabled={isTesting}
          className={`px-4 py-2 rounded-md font-medium ${
            isTesting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isTesting ? 'Running Tests...' : 'Run Integration Tests'}
        </button>
        
        <button
          onClick={resetTestResults}
          disabled={isTesting || testResults.length === 0}
          className="ml-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Results
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Test Results:</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${result.passed ? 'bg-green-900/50' : 'bg-red-900/50'}`}
              >
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium text-white">{result.test}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{result.message}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
            <p className="text-white">
              <span className="font-semibold">Note:</span> Check the browser console for detailed logs of the test execution.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

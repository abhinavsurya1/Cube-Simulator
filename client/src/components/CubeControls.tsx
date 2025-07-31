import { useCube } from '../lib/stores/useCube';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shuffle, Play, RotateCcw, Pause } from 'lucide-react';

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
      </CardContent>
    </Card>
  );
}

import { useCube } from '../lib/stores/useCube';
import { useAudio } from '../lib/stores/useAudio';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shuffle, Play, RotateCcw, Pause, VolumeX, Volume2, Square } from 'lucide-react';

export default function CubeControls() {
  const { 
    scrambleCube, 
    solveCube, 
    resetCube, 
    isAnimating, 
    isSolving,
    pauseSolving,
    resumeSolving,
    isPaused,
    currentMove,
    cubeSize,
    switchTo2x2,
    switchTo3x3
  } = useCube();
  
  const { isMuted, toggleMute } = useAudio();

  const isScrambling = isAnimating && currentMove?.includes('Scrambling');

  return (
    <Card className="bg-black/80 border-gray-600">
      <CardContent className="p-4">
        {/* Cube Size Selector */}
        <div className="flex gap-2 items-center mb-3">
          <div className="text-xs text-gray-300 mr-2">Cube Size:</div>
          <Button
            onClick={switchTo2x2}
            disabled={isAnimating || isSolving}
            className={`${
              cubeSize === 2 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            size="sm"
          >
            <Square className="w-3 h-3 mr-1" />
            2x2
          </Button>
          <Button
            onClick={switchTo3x3}
            disabled={isAnimating || isSolving}
            className={`${
              cubeSize === 3 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            size="sm"
          >
            <Square className="w-3 h-3 mr-1" />
            3x3
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button
            onClick={scrambleCube}
            disabled={isAnimating || isSolving}
            className={`${
              isScrambling 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            size="sm"
          >
            <Shuffle className={`w-4 h-4 mr-2 ${isScrambling ? 'animate-spin' : ''}`} />
            {isScrambling ? 'Scrambling...' : 'Scramble'}
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
          
          <Button
            onClick={toggleMute}
            className="bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Unmute
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Mute
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-300 text-center">
          <div>Keyboard: U R F L D B (+ Shift for reverse)</div>
          <div>Space: Scramble | Enter: Solve</div>
          <div className="text-blue-400 mt-1">Current: {cubeSize}x{cubeSize} Cube</div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useCube } from '../lib/stores/useCube';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, CheckCircle, Zap, Shuffle } from 'lucide-react';

export default function SolverProgress() {
  const { 
    isSolving, 
    isPhase1, 
    isPhase2, 
    solutionMoves, 
    currentMoveIndex,
    isSolved,
    isAnimating,
    currentMove,
    animationProgress,
    cubeSize
  } = useCube();

  const getProgress = () => {
    if (solutionMoves.length === 0) return 0;
    return (currentMoveIndex / solutionMoves.length) * 100;
  };

  const getPhaseText = () => {
    if (isSolved) return 'Solved!';
    if (isPhase2) return 'Phase 2: Permute pieces';
    if (isPhase1) return 'Phase 1: Orient pieces';
    if (isSolving) return 'Computing Kociemba solution...';
    if (isAnimating && currentMove?.includes('Scrambling')) return 'Scrambling cube...';
    return 'Ready to solve';
  };

  const getAlgorithmText = () => {
    if (isSolved) return '';
    if (isPhase2) return 'Using Kociemba Phase 2';
    if (isPhase1) return 'Using Kociemba Phase 1';
    if (isSolving) return 'Initializing Kociemba solver...';
    if (isAnimating && currentMove?.includes('Scrambling')) return 'Random scramble in progress';
    return 'Kociemba Two-Phase Algorithm';
  };

  const isScrambling = isAnimating && currentMove?.includes('Scrambling');

  return (
    <Card className="bg-black/80 border-gray-600 min-w-[200px]">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-white mb-2">
          {isSolved ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : isSolving ? (
            <Zap className="w-4 h-4 text-blue-500" />
          ) : isScrambling ? (
            <Shuffle className="w-4 h-4 text-orange-500" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          <div className="text-sm font-medium">
            {isScrambling ? 'Scramble Progress' : `${cubeSize}x${cubeSize} Kociemba Solver`}
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mb-1">
          {getPhaseText()}
        </div>
        
        <div className="text-xs text-blue-400 mb-2">
          {getAlgorithmText()}
        </div>
        
        {(solutionMoves.length > 0 || isScrambling) && (
          <>
            <Progress 
              value={isScrambling ? animationProgress : getProgress()} 
              className="h-2 mb-2" 
            />
            <div className="text-xs text-blue-400">
              {isScrambling ? (
                `Scrambling... ${Math.round(animationProgress)}%`
              ) : (
                `${currentMoveIndex}/${solutionMoves.length} moves`
              )}
            </div>
          </>
        )}
        
        {isSolved && (
          <div className="text-xs text-green-400 mt-1">
            🎉 Cube solved with Kociemba!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useCube } from '../lib/stores/useCube';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, CheckCircle } from 'lucide-react';

export default function SolverProgress() {
  const { 
    isSolving, 
    isPhase1, 
    isPhase2, 
    solutionMoves, 
    currentMoveIndex,
    isSolved 
  } = useCube();

  const getProgress = () => {
    if (solutionMoves.length === 0) return 0;
    return (currentMoveIndex / solutionMoves.length) * 100;
  };

  const getPhaseText = () => {
    if (isSolved) return 'Solved!';
    if (isPhase2) return 'Phase 2: Final solve';
    if (isPhase1) return 'Phase 1: Orient pieces';
    if (isSolving) return 'Computing solution...';
    return 'Ready to solve';
  };

  return (
    <Card className="bg-black/80 border-gray-600 min-w-[200px]">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-white mb-2">
          {isSolved ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          <div className="text-sm font-medium">
            Solver Status
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mb-2">
          {getPhaseText()}
        </div>
        
        {solutionMoves.length > 0 && (
          <>
            <Progress value={getProgress()} className="h-2 mb-2" />
            <div className="text-xs text-blue-400">
              {currentMoveIndex}/{solutionMoves.length} moves
            </div>
          </>
        )}
        
        {isSolved && (
          <div className="text-xs text-green-400 mt-1">
            🎉 Cube solved!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

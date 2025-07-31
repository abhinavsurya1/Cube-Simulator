import { useCube } from '../lib/stores/useCube';
import { Card, CardContent } from './ui/card';
import { Hash } from 'lucide-react';

export default function MoveCounter() {
  const { moves, currentMoveIndex, solutionMoves } = useCube();

  return (
    <Card className="bg-black/80 border-gray-600">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-white">
          <Hash className="w-4 h-4" />
          <div className="text-lg font-mono">
            {moves.length}
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {solutionMoves.length > 0 ? (
            <div>
              Solution: {currentMoveIndex}/{solutionMoves.length}
            </div>
          ) : (
            'Total Moves'
          )}
        </div>
        {moves.length > 0 && (
          <div className="text-xs text-blue-400 mt-1">
            Last: {moves[moves.length - 1]}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

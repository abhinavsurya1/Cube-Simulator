import { useEffect, useState } from 'react';
import { useCube } from '../lib/stores/useCube';
import { Card, CardContent } from './ui/card';
import { Clock } from 'lucide-react';

export default function GameTimer() {
  const { isTimerRunning, timerStartTime, moves, isSolving, isSolved } = useCube();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - timerStartTime);
      }, 10); // Update every 10ms for smooth display
    } else if (!isTimerRunning && timerStartTime) {
      // Keep showing the elapsed time even when timer is paused
      setElapsedTime(Date.now() - timerStartTime);
    } else if (!isTimerRunning && !timerStartTime && moves.length === 0) {
      // Only reset to 0 when timer hasn't started and no moves made
      setElapsedTime(0);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime, moves.length]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (isSolved) return 'Solved!';
    if (isSolving) return 'Solving...';
    if (isTimerRunning) return 'Running';
    if (timerStartTime) return 'Paused';
    return 'Stopped';
  };

  const getStatusColor = () => {
    if (isSolved) return 'text-green-400';
    if (isSolving) return 'text-blue-400';
    if (isTimerRunning) return 'text-green-400';
    if (timerStartTime) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <Card className="bg-black/80 border-gray-600">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-4 h-4" />
          <div className="text-lg font-mono">
            {formatTime(elapsedTime)}
          </div>
        </div>
        <div className={`text-xs mt-1 ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </CardContent>
    </Card>
  );
}

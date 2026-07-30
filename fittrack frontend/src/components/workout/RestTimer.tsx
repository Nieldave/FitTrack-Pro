import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  defaultSeconds?: number;
}

export const RestTimer: React.FC<RestTimerProps> = ({ defaultSeconds = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleReset = (seconds: number) => {
    setIsRunning(false);
    setTimeLeft(seconds);
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-zinc-400 font-medium">Rest Timer Suggestion</div>
          <div className="text-lg font-mono font-bold text-white">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-2 rounded-lg bg-orange-500 text-zinc-950 hover:bg-orange-600 font-bold"
        >
          {isRunning ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950" />}
        </button>
        <button
          onClick={() => handleReset(defaultSeconds)}
          className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimerState, TimerMode } from '@/types';

interface TimerProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: TimerMode) => void;
}

export function Timer({ timerState, onStart, onPause, onReset, onSwitchMode }: TimerProps) {
  const { mode, timeLeft, isRunning } = timerState;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = getTotalTimeForMode(mode);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const modeConfig = {
    focus: {
      label: 'Focus Time',
      color: 'primary',
      gradient: 'gradient-primary',
    },
    shortBreak: {
      label: 'Short Break',
      color: 'break',
      gradient: 'gradient-break',
    },
    longBreak: {
      label: 'Long Break', 
      color: 'break',
      gradient: 'gradient-break',
    },
  };

  const currentConfig = modeConfig[mode];

  return (
    <Card className="p-8 shadow-study-lg border-0 bg-gradient-subtle">
      {/* Mode Selector */}
      <div className="flex justify-center mb-8 gap-2">
        {(Object.keys(modeConfig) as TimerMode[]).map((timerMode) => (
          <Button
            key={timerMode}
            variant={mode === timerMode ? "default" : "ghost"}
            size="sm"
            onClick={() => onSwitchMode(timerMode)}
            className={`text-xs px-4 py-2 rounded-full transition-all duration-300 ${
              mode === timerMode 
                ? `bg-${currentConfig.color} text-${currentConfig.color}-foreground shadow-study-sm` 
                : 'hover:bg-secondary/60'
            }`}
          >
            {modeConfig[timerMode].label}
          </Button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke={`hsl(var(--${currentConfig.color}))`}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--${currentConfig.color}) / 0.3))`,
            }}
          />
        </svg>
        
        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={`${minutes}:${seconds.toString().padStart(2, '0')}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-6xl font-bold text-foreground mb-2 font-mono tabular-nums"
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </motion.div>
          <p className="text-muted-foreground font-medium">
            {currentConfig.label}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={isRunning ? onPause : onStart}
          size="lg"
          className={`h-14 w-14 rounded-full shadow-study-md transition-all duration-300 hover:scale-105 ${
            mode === 'focus' 
              ? 'bg-primary hover:bg-primary-glow' 
              : 'bg-break hover:bg-break-glow'
          }`}
        >
          {isRunning ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full shadow-study-sm hover:shadow-study-md transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}

function getTotalTimeForMode(mode: TimerMode): number {
  // Default times in seconds
  const times = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };
  return times[mode];
}
import { useState, useEffect, useRef } from 'react';
import { TimerState, TimerMode, TimerSettings } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

export function useTimer() {
  const [settings] = useLocalStorage<TimerSettings>('timer-settings', DEFAULT_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>({
    mode: 'focus',
    timeLeft: settings.focusTime * 60,
    isRunning: false,
    sessionCount: 0,
    currentTask: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update timer when settings change
  useEffect(() => {
    if (!timerState.isRunning) {
      const newTime = getTimeForMode(timerState.mode, settings);
      setTimerState(prev => ({ ...prev, timeLeft: newTime }));
    }
  }, [settings, timerState.mode, timerState.isRunning]);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            const isBreakMode = prev.mode !== 'focus';
            const newSessionCount = isBreakMode ? prev.sessionCount : prev.sessionCount + 1;
            const nextMode = getNextMode(prev.mode, newSessionCount, settings.longBreakInterval);
            
            // Show notification
            showNotification(prev.mode);
            
            return {
              ...prev,
              timeLeft: getTimeForMode(nextMode, settings),
              isRunning: false,
              mode: nextMode,
              sessionCount: newSessionCount,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.timeLeft, settings]);

  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: getTimeForMode(prev.mode, settings),
    }));
  };

  const switchMode = (mode: TimerMode) => {
    setTimerState(prev => ({
      ...prev,
      mode,
      timeLeft: getTimeForMode(mode, settings),
      isRunning: false,
    }));
  };

  const setCurrentTask = (taskId: string | null) => {
    setTimerState(prev => ({ ...prev, currentTask: taskId }));
  };

  return {
    timerState,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setCurrentTask,
  };
}

function getTimeForMode(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'focus':
      return settings.focusTime * 60;
    case 'shortBreak':
      return settings.shortBreak * 60;
    case 'longBreak':
      return settings.longBreak * 60;
    default:
      return settings.focusTime * 60;
  }
}

function getNextMode(
  currentMode: TimerMode,
  sessionCount: number,
  longBreakInterval: number
): TimerMode {
  if (currentMode === 'focus') {
    return sessionCount % longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
  }
  return 'focus';
}

function showNotification(completedMode: TimerMode) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const messages = {
      focus: '🎉 Focus session completed! Time for a break.',
      shortBreak: '💪 Break over! Ready for another focus session?',
      longBreak: '🚀 Long break finished! Ready to get back to work?',
    };
    
    new Notification('Study Timer', {
      body: messages[completedMode],
      icon: '/favicon.ico',
    });
  }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
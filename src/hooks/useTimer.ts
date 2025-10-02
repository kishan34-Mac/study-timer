import { useState, useEffect, useRef } from "react";
import { TimerState, TimerMode, TimerSettings } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

const NOTIFICATION_MESSAGES: Record<TimerMode, string> = {
  focus: "🎉 Focus session completed! Time for a break.",
  shortBreak: "💪 Break over! Ready for another focus session?",
  longBreak: "🚀 Long break finished! Ready to get back to work?",
};

export function useTimer() {
  const [settings] = useLocalStorage<TimerSettings>(
    "timer-settings",
    DEFAULT_SETTINGS
  );

  const [timerState, setTimerState] = useState<TimerState>({
    mode: "focus",
    timeLeft: settings.focusTime * 60,
    isRunning: false,
    sessionCount: 0,
    currentTask: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync timer when settings or mode changes (only if not running)
  useEffect(() => {
    if (!timerState.isRunning) {
      setTimerState((prev) => ({
        ...prev,
        timeLeft: getTimeForMode(timerState.mode, settings),
      }));
    }
  }, [settings, timerState.mode, timerState.isRunning]);

  // Timer countdown
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          if (prev.timeLeft <= 1) {
            const isBreak = prev.mode !== "focus";
            const newSessionCount = isBreak
              ? prev.sessionCount
              : prev.sessionCount + 1;
            const nextMode = getNextMode(
              prev.mode,
              newSessionCount,
              settings.longBreakInterval
            );

            triggerNotification(prev.mode);

            return {
              ...prev,
              mode: nextMode,
              timeLeft: getTimeForMode(nextMode, settings),
              isRunning: false,
              sessionCount: newSessionCount,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.isRunning, settings]);

  const startTimer = () => {
    if (!timerState.isRunning) {
      setTimerState((prev) => ({ ...prev, isRunning: true }));
    }
  };

  const pauseTimer = () => {
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: getTimeForMode(prev.mode, settings),
    }));
  };

  const switchMode = (mode: TimerMode) => {
    setTimerState((prev) => ({
      ...prev,
      mode,
      timeLeft: getTimeForMode(mode, settings),
      isRunning: false,
    }));
  };

  const setCurrentTask = (taskId: string | null) => {
    setTimerState((prev) => ({ ...prev, currentTask: taskId }));
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
    case "focus":
      return settings.focusTime * 60;
    case "shortBreak":
      return settings.shortBreak * 60;
    case "longBreak":
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
  if (currentMode === "focus") {
    return sessionCount % longBreakInterval === 0 ? "longBreak" : "shortBreak";
  }
  return "focus";
}

function triggerNotification(completedMode: TimerMode) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification("Study Timer", {
      body: NOTIFICATION_MESSAGES[completedMode],
      icon: "/favicon.ico",
    });
  }
}

// Request notification permission once on load
if (typeof window !== "undefined" && "Notification" in window) {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

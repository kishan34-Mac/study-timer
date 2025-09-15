export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedSessions: number;
  createdAt: Date;
}

export interface TimerSettings {
  focusTime: number; // in minutes
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number; // after how many sessions
}

export interface DailyStats {
  date: string;
  completedSessions: number;
  totalFocusTime: number; // in minutes
  tasksCompleted: number;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  sessionCount: number;
  currentTask: string | null;
}
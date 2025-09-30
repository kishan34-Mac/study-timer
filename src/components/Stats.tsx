import { motion } from 'framer-motion';
import { Clock, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DailyStats } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StatsProps {
  sessionCount: number;
}

export function Stats({ sessionCount }: StatsProps) {
  const [dailyStats] = useLocalStorage<DailyStats[]>('daily-stats', []);
  const today = new Date().toDateString();

  const todayStats =
    dailyStats.find(stat => stat.date === today) ?? {
      date: today,
      completedSessions: sessionCount,
      totalFocusTime: sessionCount * 25,
      tasksCompleted: 0,
    };

  const weekStats = dailyStats
    .filter(stat => new Date(stat.date) >= new Date(Date.now() - 7 * 86400000))
    .reduce(
      (a, s) => ({
        sessions: a.sessions + s.completedSessions,
        focusTime: a.focusTime + s.totalFocusTime,
        tasks: a.tasks + s.tasksCompleted,
      }),
      { sessions: 0, focusTime: 0, tasks: 0 }
    );

  const variants = {
    primary: { border: 'hover:border-primary/30', bg: 'bg-primary/10 group-hover:bg-primary/20', text: 'text-primary' },
    accent: { border: 'hover:border-accent/30', bg: 'bg-accent/10 group-hover:bg-accent/20', text: 'text-accent' },
    break: { border: 'hover:border-pink-500/30', bg: 'bg-pink-500/10 group-hover:bg-pink-500/20', text: 'text-pink-500' },
  } as const;

  const stats = [
    { label: "Today's Sessions", value: todayStats.completedSessions, icon: Target, color: 'primary', desc: 'Completed focus sessions' },
    { label: "Focus Time Today", value: `${Math.floor(todayStats.totalFocusTime / 60)}h ${todayStats.totalFocusTime % 60}m`, icon: Clock, color: 'accent', desc: 'Time spent in focus mode' },
    { label: "Tasks Completed", value: todayStats.tasksCompleted, icon: CheckCircle, color: 'accent', desc: 'Tasks marked as done' },
    { label: "Weekly Sessions", value: weekStats.sessions, icon: TrendingUp, color: 'break', desc: 'Total sessions this week' },
  ];

  return (
    <Card className="p-6 shadow-study-md border-0 bg-gradient-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-accent rounded-full animate-pulse" /> Live tracking
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color, desc }, i) => {
          const v = variants[color];
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-4 rounded-lg bg-card border border-border/50 ${v.border} transition-all group hover:shadow-study-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  <motion.p key={value} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-2xl font-bold mb-2">
                    {value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <div className={`p-2 rounded-lg ${v.bg} transition-colors`}>
                  <Icon className={`h-5 w-5 ${v.text}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Progress */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Weekly Goal Progress</span>
          <span className="text-sm text-muted-foreground">{weekStats.sessions}/20 sessions</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((weekStats.sessions / 20) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-primary rounded-full"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {weekStats.sessions >= 20 ? '🎉 Weekly goal achieved!' : `${20 - weekStats.sessions} more sessions to reach your weekly goal`}
        </p>
      </div>
    </Card>
  );
}

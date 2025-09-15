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
  const todayStats = dailyStats.find(stat => stat.date === today) || {
    date: today,
    completedSessions: sessionCount,
    totalFocusTime: sessionCount * 25, // Assuming 25 min sessions
    tasksCompleted: 0,
  };

  const weekStats = dailyStats
    .filter(stat => {
      const statDate = new Date(stat.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return statDate >= weekAgo;
    })
    .reduce(
      (acc, stat) => ({
        sessions: acc.sessions + stat.completedSessions,
        focusTime: acc.focusTime + stat.totalFocusTime,
        tasks: acc.tasks + stat.tasksCompleted,
      }),
      { sessions: 0, focusTime: 0, tasks: 0 }
    );

  const stats = [
    {
      label: "Today's Sessions",
      value: todayStats.completedSessions,
      icon: Target,
      color: 'primary',
      description: 'Completed focus sessions',
    },
    {
      label: "Focus Time Today",
      value: `${Math.floor(todayStats.totalFocusTime / 60)}h ${todayStats.totalFocusTime % 60}m`,
      icon: Clock,
      color: 'accent',
      description: 'Time spent in focus mode',
    },
    {
      label: "Tasks Completed",
      value: todayStats.tasksCompleted,
      icon: CheckCircle,
      color: 'accent',
      description: 'Tasks marked as done',
    },
    {
      label: "Weekly Sessions",
      value: weekStats.sessions,
      icon: TrendingUp,
      color: 'break',
      description: 'Total sessions this week',
    },
  ];

  return (
    <Card className="p-6 shadow-study-md border-0 bg-gradient-subtle">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Your Progress</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
          Live tracking
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-4 rounded-lg bg-card border border-border/50 hover:border-${stat.color}/30 transition-all duration-300 group hover:shadow-study-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <motion.p
                    key={stat.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-foreground mb-2"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors`}>
                  <Icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Progress Indicator */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Weekly Goal Progress</span>
          <span className="text-sm text-muted-foreground">{weekStats.sessions}/20 sessions</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((weekStats.sessions / 20) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-primary rounded-full shadow-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {weekStats.sessions >= 20 ? '🎉 Weekly goal achieved!' : `${20 - weekStats.sessions} more sessions to reach your weekly goal`}
        </p>
      </div>
    </Card>
  );
}
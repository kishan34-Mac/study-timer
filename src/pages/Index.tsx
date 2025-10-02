import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Timer } from "@/components/Timer";
import { TaskList } from "@/components/TaskList";
import { Stats } from "@/components/Stats";
import { Settings } from "@/components/Settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTimer } from "@/hooks/useTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 🔹 Helper component for consistent fade/slide animations
const FadeIn = ({
  children,
  delay = 0.2,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}) => {
  const variants: Record<string, object> = {
    up: { opacity: 0, y: 20 },
    down: { opacity: 0, y: -20 },
    left: { opacity: 0, x: -20 },
    right: { opacity: 0, x: 20 },
  };
  return (
    <motion.div
      initial={variants[direction]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, switchMode, setCurrentTask } = useTimer();
  const [activeTab, setActiveTab] = useState("timer");

  // 🔹 Memoize props to avoid unnecessary re-renders
  const timerProps = useMemo(
    () => ({
      timerState,
      onStart: startTimer,
      onPause: pauseTimer,
      onReset: resetTimer,
      onSwitchMode: switchMode,
    }),
    [timerState, startTimer, pauseTimer, resetTimer, switchMode]
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <FadeIn direction="left">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 bg-gradient-primary rounded-lg shadow-study-sm"
                  aria-hidden="true"
                />
                <h1 className="text-2xl font-bold text-foreground">Study Timer</h1>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      timerState.isRunning ? "bg-primary animate-pulse" : "bg-muted"
                    }`}
                    aria-hidden="true"
                  />
                  {timerState.isRunning ? "Timer Active" : "Timer Paused"}
                </div>
                <ThemeToggle aria-label="Toggle theme" />
              </div>
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <FadeIn delay={0.2}>
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-4 bg-card shadow-study-sm">
                  <TabsTrigger
                    value="timer"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Timer
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </FadeIn>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8">
              <FadeIn direction="left" delay={0.3} className="col-span-6 xl:col-span-5">
                <Timer {...timerProps} />
              </FadeIn>

              <div className="col-span-6 xl:col-span-7 space-y-6">
                <FadeIn direction="right" delay={0.4}>
                  <TaskList
                    currentTaskId={timerState.currentTask}
                    onTaskSelect={setCurrentTask}
                  />
                </FadeIn>
                <FadeIn direction="right" delay={0.5}>
                  <Stats sessionCount={timerState.sessionCount} />
                </FadeIn>
              </div>
            </div>

            {/* Mobile / Tablet Layout */}
            <div className="lg:hidden">
              <TabsContent value="timer">
                <FadeIn delay={0.3}>
                  <Timer {...timerProps} />
                </FadeIn>
              </TabsContent>

              <TabsContent value="tasks">
                <FadeIn delay={0.3}>
                  <TaskList
                    currentTaskId={timerState.currentTask}
                    onTaskSelect={setCurrentTask}
                  />
                </FadeIn>
              </TabsContent>

              <TabsContent value="stats">
                <FadeIn delay={0.3}>
                  <Stats sessionCount={timerState.sessionCount} />
                </FadeIn>
              </TabsContent>

              <TabsContent value="settings">
                <FadeIn delay={0.3}>
                  <Settings />
                </FadeIn>
              </TabsContent>
            </div>

            {/* Desktop Settings Overlay */}
            <div className="hidden lg:block">
              {activeTab === "settings" && (
                <FadeIn delay={0.3} className="max-w-md mx-auto">
                  <Settings />
                </FadeIn>
              )}
            </div>
          </Tabs>

          {/* Current Session Info */}
          {timerState.currentTask && (
            <FadeIn delay={0.4} className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
                Currently working on a task
              </div>
            </FadeIn>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 text-center">
          <FadeIn delay={0.8}>
            <p className="text-sm text-muted-foreground">
              Stay focused, stay productive. Built with ❤️ for better concentration.
            </p>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer } from '@/components/Timer';
import { TaskList } from '@/components/TaskList';
import { Stats } from '@/components/Stats';
import { Settings } from '@/components/Settings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTimer } from '@/hooks/useTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, switchMode, setCurrentTask } = useTimer();
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-8 w-8 bg-gradient-primary rounded-lg shadow-study-sm" />
              <h1 className="text-2xl font-bold text-foreground">Study Timer</h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`h-2 w-2 rounded-full ${timerState.isRunning ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                {timerState.isRunning ? 'Timer Active' : 'Timer Paused'}
              </div>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Mobile-first responsive layout */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigatin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
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
            </motion.div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8">
              {/* Left Column - Timer */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-6 xl:col-span-5"
              >
                <Timer
                  timerState={timerState}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onReset={resetTimer}
                  onSwitchMode={switchMode}
                />
              </motion.div>

              {/* Right Column - Tasks & Stats */}
              <div className="col-span-6 xl:col-span-7 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <TaskList
                    currentTaskId={timerState.currentTask}
                    onTaskSelect={setCurrentTask}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Stats sessionCount={timerState.sessionCount} />
                </motion.div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - Tabbed Content */}
            <div className="lg:hidden">
              <TabsContent value="timer" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Timer
                    timerState={timerState}
                    onStart={startTimer}
                    onPause={pauseTimer}
                    onReset={resetTimer}
                    onSwitchMode={switchMode}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TaskList
                    currentTaskId={timerState.currentTask}
                    onTaskSelect={setCurrentTask}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Stats sessionCount={timerState.sessionCount} />
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Settings />
                </motion.div>
              </TabsContent>
            </div>

            {/* Desktop Settings - Always visible as overlay when needed */}
            <div className="hidden lg:block">
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto"
                >
                  <Settings />
                </motion.div>
              )}
            </div>
          </Tabs>

          {/* Current Session Info */}
          {timerState.currentTask && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                Currently working on a task
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground"
          >
            Stay focused, stay productive. Built with ❤️ for better concentration.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TaskListProps {
  currentTaskId: string | null;
  onTaskSelect: (taskId: string | null) => void;
}

export function TaskList({ currentTaskId, onTaskSelect }: TaskListProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // --- Handlers ---
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        completedSessions: 0,
        createdAt: new Date(),
      },
    ]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) =>
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (currentTaskId === id) onTaskSelect(null);
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      setTasks(prev =>
        prev.map(t =>
          t.id === editingId ? { ...t, title: editTitle.trim() } : t
        )
      );
    }
    setEditingId(null);
    setEditTitle('');
  };

  // --- Motion Variants ---
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <Card className="p-6 shadow-study-md border-0 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} active
        </span>
      </div>

      {/* Add New Task */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          className="flex-1 border-border/50 focus:border-primary transition-colors"
        />
        <Button
          onClick={handleAddTask}
          size="icon"
          className="h-10 w-10 rounded-lg bg-primary hover:bg-primary-glow shadow-study-sm transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 hover:shadow-study-sm
                ${currentTaskId === task.id ? 'border-primary bg-primary/5 shadow-study-sm' : 'border-border/50 bg-background hover:bg-secondary/30'}
                ${task.completed ? 'opacity-60' : ''}`}
            >
              {/* Checkbox */}
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />

              {/* Task Title / Edit Field */}
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <Input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                    onBlur={handleSaveEdit}
                    className="h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => onTaskSelect(currentTaskId === task.id ? null : task.id)}
                    className={`cursor-pointer transition-colors hover:text-primary ${
                      task.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    <p className="font-medium truncate">{task.title}</p>
                    {task.completedSessions > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {task.completedSessions} sessions completed
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-secondary/60"
                  onClick={() => handleStartEdit(task)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Active Indicator */}
              {currentTaskId === task.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-2 w-2 bg-primary rounded-full"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <Check className="h-12 w-12 mx-auto opacity-30 mb-4" />
            <p className="text-lg font-medium mb-1">No tasks yet</p>
            <p className="text-sm">Add your first task to get started 🎯</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

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

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        completedSessions: 0,
        createdAt: new Date(),
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (currentTaskId === id) {
      onTaskSelect(null);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingId ? { ...task, title: editTitle.trim() } : task
        )
      );
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <Card className="p-6 shadow-study-md border-0 bg-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Tasks</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} active
        </span>
      </div>

      {/* Add New Task */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addTask)}
          className="flex-1 border-border/50 focus:border-primary transition-colors"
        />
        <Button
          onClick={addTask}
          size="icon"
          className="h-10 w-10 rounded-lg bg-primary hover:bg-primary-glow shadow-study-sm transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 hover:shadow-study-sm ${
                currentTaskId === task.id
                  ? 'border-primary bg-primary/5 shadow-study-sm'
                  : 'border-border/50 bg-background hover:bg-secondary/30'
              } ${task.completed ? 'opacity-60' : ''}`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />

              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    onBlur={saveEdit}
                    className="h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <div
                    className={`cursor-pointer transition-colors hover:text-primary ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                    onClick={() => onTaskSelect(currentTaskId === task.id ? null : task.id)}
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

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-secondary/60"
                  onClick={() => startEditing(task)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

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

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <div className="mb-4">
              <Check className="h-12 w-12 mx-auto opacity-30" />
            </div>
            <p className="text-lg font-medium mb-2">No tasks yet</p>
            <p className="text-sm">Add your first task to get started with focused study sessions.</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
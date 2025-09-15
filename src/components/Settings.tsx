import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TimerSettings } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

export function Settings() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('timer-settings', DEFAULT_SETTINGS);
  const [tempSettings, setTempSettings] = useState(settings);
  const { toast } = useToast();

  const handleSave = () => {
    // Validate settings
    if (tempSettings.focusTime < 1 || tempSettings.focusTime > 120) {
      toast({
        title: "Invalid Focus Time",
        description: "Focus time must be between 1 and 120 minutes.",
        variant: "destructive",
      });
      return;
    }

    if (tempSettings.shortBreak < 1 || tempSettings.shortBreak > 30) {
      toast({
        title: "Invalid Short Break",
        description: "Short break must be between 1 and 30 minutes.",
        variant: "destructive",
      });
      return;
    }

    if (tempSettings.longBreak < 1 || tempSettings.longBreak > 60) {
      toast({
        title: "Invalid Long Break",
        description: "Long break must be between 1 and 60 minutes.",
        variant: "destructive",
      });
      return;
    }

    setSettings(tempSettings);
    toast({
      title: "Settings Saved",
      description: "Your timer preferences have been updated.",
    });
  };

  const handleReset = () => {
    setTempSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings Reset",
      description: "Timer settings have been restored to defaults.",
    });
  };

  const updateSetting = (key: keyof TimerSettings, value: number) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingItems = [
    {
      key: 'focusTime' as keyof TimerSettings,
      label: 'Focus Time',
      description: 'Duration of focus sessions',
      unit: 'minutes',
      min: 1,
      max: 120,
    },
    {
      key: 'shortBreak' as keyof TimerSettings,
      label: 'Short Break',
      description: 'Duration of short breaks',
      unit: 'minutes',
      min: 1,
      max: 30,
    },
    {
      key: 'longBreak' as keyof TimerSettings,
      label: 'Long Break',
      description: 'Duration of long breaks',
      unit: 'minutes',
      min: 1,
      max: 60,
    },
    {
      key: 'longBreakInterval' as keyof TimerSettings,
      label: 'Long Break Interval',
      description: 'Long break after this many sessions',
      unit: 'sessions',
      min: 2,
      max: 8,
    },
  ];

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(tempSettings);

  return (
    <Card className="p-6 shadow-study-md border-0 bg-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Timer Settings</h2>
      </div>

      <div className="space-y-6">
        {settingItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor={item.key} className="text-sm font-medium text-foreground">
              {item.label}
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id={item.key}
                type="number"
                min={item.min}
                max={item.max}
                value={tempSettings[item.key]}
                onChange={(e) => updateSetting(item.key, parseInt(e.target.value) || 0)}
                className="w-20 text-center border-border/50 focus:border-primary transition-colors"
              />
              <span className="text-sm text-muted-foreground">{item.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-border/50">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1 bg-primary hover:bg-primary-glow shadow-study-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-border/50 hover:bg-secondary/60 hover:border-primary/30 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {hasChanges && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground mt-3 text-center"
        >
          You have unsaved changes
        </motion.p>
      )}
    </Card>
  );
}
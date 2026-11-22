'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
  };

  const labels = {
    light: 'Light mode',
    dark: 'Dark mode',
    system: 'System mode',
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-elegant transition-all hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        className
      )}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      {icons[theme]}
      {showLabel && <span className="text-muted-foreground">{labels[theme]}</span>}
    </button>
  );
}
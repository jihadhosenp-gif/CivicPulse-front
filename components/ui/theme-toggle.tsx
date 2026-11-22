'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Theme } from '@/utils/theme';
import { useTheme } from './theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const options: Array<{ value: Theme; label: string; icon: React.ElementType }> =
  [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

export function ThemeToggle({
  className,
  showLabel = true,
}: ThemeToggleProps = {}) {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();
  const reduceMotion = useReducedMotion();

  // Before hydration the stored preference is unknown. Render a stable
  // placeholder on both server and client, then swap to the real icon.
  const activeTheme: Theme | null = mounted ? theme : null;
  const activeIcon = activeTheme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const Icon = activeTheme ? activeIcon : Monitor;
  const iconKey = activeTheme ?? 'pending';
  const currentLabel = activeTheme
    ? options.find((option) => option.value === activeTheme)?.label ?? 'Theme'
    : 'Theme';
  const nextLabel = resolvedTheme === 'dark' ? 'Light' : 'Dark';

  return (
    <DropdownMenu>
      <div className={cn('relative inline-flex items-center gap-1', className)}>
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          aria-label={`Current theme: ${currentLabel}. Switch to ${nextLabel} theme`}
          title={`Current theme: ${currentLabel}`}
          className={cn(
            'group relative flex h-11 min-w-11 flex-1 items-center justify-center gap-2 overflow-visible rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground shadow-elegant transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={iconKey}
              initial={reduceMotion ? false : { opacity: 0, rotate: -35, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 35, scale: 0.7 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </motion.span>
          </AnimatePresence>

          {showLabel && (
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              {currentLabel}
            </span>
          )}

          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Current theme: {currentLabel}
          </span>
        </motion.button>

        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Choose theme preference"
            title="Choose theme preference"
            className="flex h-11 w-8 shrink-0 items-center justify-center rounded-xl border border-input bg-background text-muted-foreground shadow-elegant transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => {
            const OptionIcon = option.icon;
            const isActive = mounted && theme === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(isActive && 'bg-accent/60 text-foreground')}
              >
                <OptionIcon className="h-4 w-4" aria-hidden="true" />
                <span>{option.label}</span>
                {isActive && (
                  <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

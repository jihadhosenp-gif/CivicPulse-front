'use client';

import * as React from 'react';
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isTheme,
  type ResolvedTheme,
  type Theme,
} from '@/utils/theme';

interface ThemeContextValue {
  /** The user's stored preference. */
  theme: Theme;
  /** The palette currently painted on screen. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  /** Flips light <-> dark using the currently visible palette. */
  toggleTheme: () => void;
  /** False until the stored preference has been read on the client. */
  mounted: boolean;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyResolvedTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>('light');
  const [mounted, setMounted] = React.useState(false);

  // The inline bootstrap script has already applied the correct class before
  // paint. Here we only synchronise React state with that stored preference.
  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(storageKey);
    } catch {
      // Storage can be unavailable (private mode / embedded webviews).
    }
    setThemeState(isTheme(stored) ? stored : defaultTheme);
    setSystemTheme(getSystemTheme());
    setMounted(true);
  }, [defaultTheme, storageKey]);

  // Follow OS changes only while "system" is the active preference.
  React.useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(getSystemTheme());
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme]);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  React.useEffect(() => {
    if (!mounted) return;
    applyResolvedTheme(resolvedTheme);
  }, [mounted, resolvedTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Preference still applies for this session.
      }
    },
    [storageKey]
  );

  const toggleTheme = React.useCallback(() => {
    const current: ResolvedTheme =
      theme === 'system' ? getSystemTheme() : theme;
    setTheme(current === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, mounted }),
    [theme, resolvedTheme, setTheme, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
export type { ResolvedTheme, Theme } from '@/utils/theme';

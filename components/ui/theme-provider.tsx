'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'civicpulse-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  const resolvedTheme = React.useMemo(() => {
    if (typeof window === 'undefined') return 'light';
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme, mounted]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!mounted || theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.toggle('dark', mediaQuery.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(storageKey, next);
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, setTheme, resolvedTheme: 'light' }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
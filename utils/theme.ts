/**
 * Shared theme constants and the pre-hydration bootstrap script.
 *
 * This module is intentionally framework-agnostic ("use client" is not used)
 * so it can be imported by both the server root layout and the client
 * ThemeProvider without creating a client/server boundary mismatch.
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'civicpulse-theme';
export const DEFAULT_THEME: Theme = 'light';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Applied before React hydrates so the correct palette is painted on the very
 * first frame. Explicit preferences win; "system" follows the OS setting.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY
)};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark"||s==="system")?s:${JSON.stringify(
  DEFAULT_THEME
)};var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

import { useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/theme-boot';

export type Theme = 'dark' | 'light';

// The theme is the `dark` class on <html>, which is what Tailwind and the CSS variables already key on.
// theme-boot.ts sets it before the first paint; this module reads and changes it afterwards.

const listeners = new Set<() => void>();

export const getTheme = (): Theme =>
  typeof document === 'undefined' || document.documentElement.classList.contains('dark') ? 'dark' : 'light';

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* private window: the theme still applies */ }
  listeners.forEach(listener => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

// For the few components that pick colours in JavaScript. Everything else follows the CSS variables.
export const useTheme = (): Theme => useSyncExternalStore(subscribe, getTheme, () => 'dark');

'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeTransition } from '@/hooks/use-theme-transition';
import { cn } from '@/lib/utils';

// Both icons are rendered and CSS shows the right one, so a saved light theme never shows the wrong
// icon while the page hydrates.
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeTransition();
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={event => toggleTheme(event.currentTarget)}
      className={cn('h-9 w-9 flex-none', className)}
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
    </Button>
  );
}

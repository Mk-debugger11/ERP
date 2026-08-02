import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();


  return (
    <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/70 shadow-subtle">
      <button
        onClick={() => setTheme('light')}
        type="button"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          theme === 'light'
            ? 'bg-card text-foreground shadow-subtle'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        type="button"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          theme === 'dark'
            ? 'bg-card text-foreground shadow-subtle'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        onClick={() => setTheme('system')}
        type="button"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          theme === 'system'
            ? 'bg-card text-foreground shadow-subtle'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System Preference Mode"
      >
        <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Auto</span>
      </button>
    </div>
  );
};

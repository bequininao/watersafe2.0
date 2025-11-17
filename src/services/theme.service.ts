import { Injectable, signal, WritableSignal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'violet' | 'orange';
export const availableAccentColors: AccentColor[] = ['blue', 'green', 'violet', 'orange'];

const colorMap: Record<AccentColor, { light: Record<string, string>, dark: Record<string, string> }> = {
  blue: {
    light: { '--accent-500': '#3b82f6', '--accent-400': '#60a5fa' }, // blue-600, blue-400
    dark: { '--accent-500': '#60a5fa', '--accent-400': '#93c5fd' },  // blue-400, blue-300
  },
  green: {
    light: { '--accent-500': '#22c55e', '--accent-400': '#4ade80' }, // green-500, green-400
    dark: { '--accent-500': '#4ade80', '--accent-400': '#86efac' },  // green-400, green-300
  },
  violet: {
    light: { '--accent-500': '#8b5cf6', '--accent-400': '#a78bfa' }, // violet-500, violet-400
    dark: { '--accent-500': '#a78bfa', '--accent-400': '#c4b5fd' },  // violet-400, violet-300
  },
  orange: {
    light: { '--accent-500': '#f97316', '--accent-400': '#fb923c' }, // orange-500, orange-400
    dark: { '--accent-500': '#fb923c', '--accent-400': '#fdba74' },  // orange-400, orange-300
  },
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: WritableSignal<Theme>;
  accentColor: WritableSignal<AccentColor>;

  constructor() {
    const initialTheme = this.getInitialTheme();
    this.theme = signal(initialTheme);
    const initialAccentColor = this.getInitialAccentColor();
    this.accentColor = signal(initialAccentColor);

    // Effect to apply theme changes to the DOM and localStorage
    effect(() => {
      const newTheme = this.theme();
      const newAccent = this.accentColor();
      
      // Apply theme class and accent colors to the document element
      if (typeof document !== 'undefined') {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        const colors = colorMap[newAccent][newTheme];
        for (const [key, value] of Object.entries(colors)) {
          document.documentElement.style.setProperty(key, value);
        }
      }

      // Save preferences to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', newTheme);
          localStorage.setItem('accentColor', newAccent);
        } catch (e) {
          // Fix: Use a format specifier to safely log the unknown error object.
          // This satisfies strict type checking while preserving object inspectability in the console.
          console.error('Failed to save theme to localStorage: %o', e);
        }
      }
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme ?? (prefersDark ? 'dark' : 'light');
  }

  private getInitialAccentColor(): AccentColor {
    if (typeof window === 'undefined') {
      return 'blue';
    }
    return (localStorage.getItem('accentColor') as AccentColor) || 'blue';
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  setAccentColor(color: AccentColor): void {
    this.accentColor.set(color);
  }
}
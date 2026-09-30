import { useEffect, useState, useCallback } from 'react';

const KEY = 'aags-theme';

const apply = (theme) => {
  const root = document.documentElement;
  root.classList.toggle('light', theme === 'light');
  root.setAttribute('data-theme', theme);
};

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  return { theme, isLight: theme === 'light', toggle };
}

import { useEffect, useState, useCallback } from 'react';

const KEY = 'aags-theme';

const getSavedTheme = () => {
  try {
    return localStorage.getItem(KEY) || 'dark';
  } catch {
    return 'dark';
  }
};

const apply = (theme) => {
  const root = document.documentElement;
  root.classList.toggle('light', theme === 'light');
  root.setAttribute('data-theme', theme);
};

export default function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    const syncTheme = (event) => {
      const newTheme = event.detail || getSavedTheme();
      setTheme(newTheme);
    };

    window.addEventListener('aags-theme-change', syncTheme);

    return () => {
      window.removeEventListener('aags-theme-change', syncTheme);
    };
  }, []);

  useEffect(() => {
    apply(theme);

    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const toggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    try {
      localStorage.setItem(KEY, newTheme);
    } catch {
      // Ignore storage errors
    }

    window.dispatchEvent(
      new CustomEvent('aags-theme-change', {
        detail: newTheme
      })
    );

    setTheme(newTheme);
  }, [theme]);

  return {
    theme,
    isLight: theme === 'light',
    toggle
  };
}

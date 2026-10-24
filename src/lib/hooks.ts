import { useCallback, useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown;
}

/** Minimal data hook: runs the loader once per dependency change. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState({ data: undefined, loading: true, error: null });
    fn()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (alive) setState({ data: undefined, loading: false, error });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useTheme(): {
  theme: 'light' | 'dark';
  toggle: () => void;
} {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light',
  );

  // Track OS changes while the user has no explicit preference.
  useEffect(() => {
    if (localStorage.getItem('veltrion-theme')) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const apply = useCallback((next: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#000000' : '#f5f5f7');
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('veltrion-theme', next);
    apply(next);
  }, [theme, apply]);

  return { theme, toggle };
}

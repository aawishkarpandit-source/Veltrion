import { useEffect, useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms (60–90ms between parts of a section). */
  delay?: number;
  className?: string;
}

/**
 * Scroll entrance: opacity + 16px rise, once, eased. Pure transform/opacity —
 * reduced-motion users get the content instantly (handled in CSS).
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IntersectionObserver is unavailable, show the content immediately.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    // Safety net: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(() => el.classList.add('is-visible'), 2000);
    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

import { useEffect, useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms (60–90ms between parts of a section). */
  delay?: number;
  /** 'rise' = translate up. 'tilt3d' = perspective rotateX rise (hero/cards). */
  variant?: 'rise' | 'tilt3d';
  className?: string;
}

/**
 * Scroll entrance via IntersectionObserver + CSS transition (transform/opacity
 * only, GPU composited). IO is bulletproof — content is revealed the moment it
 * enters the viewport, and a timeout failsafe guarantees it is never left
 * invisible. Reduced-motion users see content instantly via CSS. GSAP is
 * reserved for decorative scrub motion elsewhere; content reveals never depend
 * on it so nothing can get stuck hidden.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'rise',
  className = '',
}: RevealProps) {
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

    // Failsafe: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(() => el.classList.add('is-visible'), 2000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variant === 'tilt3d' ? 'reveal-3d' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

// GSAP motion layer for VELTRION.
// All scroll-driven 3D animation is built on transform + opacity only so it
// stays on the GPU compositor (per the animation-performance rules). Every
// helper is gated behind prefers-reduced-motion.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Live preference for reduced motion; updates if the user flips it. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduce;
}

/**
 * Run a set of GSAP ScrollTriggers scoped to a container, with automatic
 * cleanup on unmount and a refresh once fonts/layout settle. Returns nothing.
 * The callback receives the scoped context so it can create tweens.
 */
export function useScrollScene(
  ref: React.RefObject<HTMLElement | null>,
  build: (ctx: gsap.Context, reduced: boolean) => void,
  deps: unknown[] = [],
): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context((self) => build(self, reduced), el);

    // Recalculate trigger positions after fonts load / images size.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 300);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, reduced, ...deps]);
}

/** Kill every live ScrollTrigger (used on route teardown as a safety net). */
export function killAllTriggers(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

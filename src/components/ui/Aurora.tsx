import { useRef } from 'react';
import { gsap, useScrollScene, useReducedMotion } from '../../lib/motion';

/**
 * Ambient aurora: three blurred gradient blobs that drift on their own (CSS)
 * and parallax on scroll (GSAP). Pure transform + opacity / blur — GPU-friendly.
 * Used behind the hero and page intros for cinematic depth.
 */
export default function Aurora({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useScrollScene(ref, (_ctx, isReduced) => {
    if (isReduced) return;
    // Scroll parallax — blobs rise at different speeds as you scroll down.
    gsap.to('.a1', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.a2', {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.a3', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={ref} className={`hero-aurora ${className}`} aria-hidden="true" data-motion={reduced ? 'off' : 'on'}>
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
    </div>
  );
}

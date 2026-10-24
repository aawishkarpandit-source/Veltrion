import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, useReducedMotion } from '../../lib/motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Kept subtle so copy stays readable. */
  max?: number;
}

/**
 * Pointer-tracked 3D tilt for a card. Only activates on fine pointers
 * (hover + mouse), disabled entirely under reduced motion. Writes transform
 * straight to the element via GSAP quickTo — no React re-render per frame.
 */
export default function TiltCard({ children, className = '', max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Touch / coarse pointers: skip the tilt entirely.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    gsap.set(el, { transformPerspective: 900 });

    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      xTo(px * max * 2);
      yTo(-py * max * 2);
      // Feed the sheen highlight position via CSS custom props.
      el!.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
      el!.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
    }

    function onLeave() {
      xTo(0);
      yTo(0);
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, max]);

  return (
    <div className={`card-wrap ${className}`}>
      <div ref={ref} className="card">
        {children}
      </div>
    </div>
  );
}

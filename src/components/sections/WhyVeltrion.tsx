import { useRef } from 'react';
import { useAsync } from '../../lib/hooks';
import { getTextBlocks, getWhyPoints } from '../../lib/content';
import { gsap, useScrollScene } from '../../lib/motion';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';

export default function WhyVeltrion() {
  const { data: points } = useAsync(() => getWhyPoints(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const sceneRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed 3D: the statement tilts back into perspective, then
  // settles upright as it reaches the center of the viewport.
  useScrollScene(sceneRef, (_ctx, reduced) => {
    if (reduced) return;
    gsap.fromTo(
      '.why-statement',
      { rotateX: 14, y: 40, scale: 0.94, opacity: 0.4, transformOrigin: 'center bottom' },
      {
        rotateX: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.why-statement',
          start: 'top 85%',
          end: 'center 55%',
          scrub: 1,
        },
      },
    );
  });

  return (
    <section ref={sceneRef} className="section section-wash">
      <div className="section-inner">
        <div className="statement why-statement">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            Why Veltrion
          </p>
          <h2 className="heading">{blocks?.['why.title'] ?? 'Why Veltrion.'}</h2>
          <p className="subheading">
            {blocks?.['why.statement'] ?? 'Precision. Reliability. Simplicity. Professionalism.'}
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: 'var(--spacing-56)' }}>
          {(points ?? []).map((point, i) => (
            <Reveal key={point.id} delay={(i % 3) * 70} variant="tilt3d">
              <TiltCard>
                <h3 className="card-title">{point.title}</h3>
                <p className="card-desc">{point.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

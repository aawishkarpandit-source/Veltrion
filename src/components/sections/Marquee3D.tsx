import { useRef } from 'react';
import { useAsync } from '../../lib/hooks';
import { getTextBlocks } from '../../lib/content';
import { gsap, useScrollScene } from '../../lib/motion';
import Reveal from '../ui/Reveal';

const CAPABILITIES = [
  'Websites',
  'Custom Software',
  'Web Apps',
  'Databases',
  'Management Systems',
  'Marketing',
  'Hosting & Support',
  'Design',
];

/**
 * Signature 3D scroll band: a full-bleed row of capability chips set in
 * perspective that scrubs horizontally and levels out of a tilt as it crosses
 * the viewport. Transform + opacity only; static (non-tilted) under reduced
 * motion or when off-screen.
 */
export default function Marquee3D() {
  const ref = useRef<HTMLElement>(null);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  useScrollScene(ref, (_ctx, reduced) => {
    if (reduced) return;
    const track = ref.current?.querySelector('.marquee-track');
    if (!track) return;

    // Horizontal scrub across the full scroll range of the band.
    gsap.fromTo(
      track,
      { xPercent: 6 },
      {
        xPercent: -34,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    );

    // Level out of a 3D tilt as the band reaches center.
    gsap.fromTo(
      '.marquee-stage',
      { rotateX: 16, rotateZ: -3, scale: 0.92, transformOrigin: 'center center' },
      {
        rotateX: 0,
        rotateZ: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'center 55%',
          scrub: 1,
        },
      },
    );
  });

  const title = blocks?.['services.title'] ?? 'What we do.';

  return (
    <section ref={ref} className="marquee-band" aria-label="Capabilities">
      <div className="marquee-stage">
        <Reveal className="marquee-head" variant="tilt3d">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            Built end to end
          </p>
          <h2 className="heading-sm">{title}</h2>
        </Reveal>
        <div className="marquee-viewport">
          <div className="marquee-track">
            {CAPABILITIES.concat(CAPABILITIES).map((word, i) => (
              <span key={`${word}-${i}`} className="marquee-chip">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

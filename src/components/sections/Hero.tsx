import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAsync, useTheme } from '../../lib/hooks';
import { getTextBlocks } from '../../lib/content';
import { gsap, useScrollScene } from '../../lib/motion';
import Reveal from '../ui/Reveal';
import Aurora from '../ui/Aurora';

export default function Hero() {
  const { theme } = useTheme();
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const dark = theme === 'dark';
  const sceneRef = useRef<HTMLElement>(null);

  const headline = blocks?.['home.hero.headline'] ?? "Engineered for What's Next.";
  const subline =
    blocks?.['home.hero.subline'] ?? 'Websites, software, business systems, design, marketing and support.';
  const ctaPrimary = blocks?.['home.hero.cta_primary'] ?? 'See our work';
  const ctaSecondary = blocks?.['home.hero.cta_secondary'] ?? 'Contact us';

  // Scroll-linked 3D: logo recedes in Z, headline rises, actions follow.
  useScrollScene(sceneRef, (_ctx, reduced) => {
    if (reduced) return;
    gsap.to('.hero-logo', {
      yPercent: -14,
      scale: 0.94,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: sceneRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-tagline', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: sceneRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  return (
    <section ref={sceneRef} className="hero">
      <Aurora />
      <Reveal variant="tilt3d">
        <img
          className="hero-logo"
          src={dark ? '/logo/dark-logo-no-text.png' : '/logo/logo-no-text.png'}
          alt="VELTRION"
          width={2000}
          height={2000}
        />
      </Reveal>
      <Reveal delay={80} variant="tilt3d">
        <h1 className="display hero-tagline grad-text">{headline}</h1>
        <p className="subheading hero-subline">{subline}</p>
        <div className="hero-actions">
          <Link to="/our-work" className="btn btn-filled">
            {ctaPrimary}
          </Link>
          <Link to="/contact" className="btn btn-outlined">
            {ctaSecondary}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

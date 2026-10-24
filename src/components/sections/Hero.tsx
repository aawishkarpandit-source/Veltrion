import { Link } from 'react-router-dom';
import { useAsync, useTheme } from '../../lib/hooks';
import { getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';

export default function Hero() {
  const { theme } = useTheme();
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const dark = theme === 'dark';

  const headline = blocks?.['home.hero.headline'] ?? "Engineered for What's Next.";
  const subline =
    blocks?.['home.hero.subline'] ?? 'Websites, software, business systems, design, marketing and support.';
  const ctaPrimary = blocks?.['home.hero.cta_primary'] ?? 'See our work';
  const ctaSecondary = blocks?.['home.hero.cta_secondary'] ?? 'Contact us';

  return (
    <section className="hero">
      <Reveal>
        <img
          className="hero-logo"
          src={dark ? '/logo/dark-full-size-logo.png' : '/logo/full-size-logo.png'}
          alt="VELTRION"
          width={560}
          height={180}
        />
      </Reveal>
      <Reveal delay={80}>
        <h1 className="display hero-tagline">{headline}</h1>
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

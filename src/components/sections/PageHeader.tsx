import type { ReactNode } from 'react';
import Reveal from '../ui/Reveal';
import Aurora from '../ui/Aurora';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
}

/** Cinematic page intro: aurora backdrop + 3D tilt reveal. */
export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header className="page-intro">
      <Aurora />
      <Reveal variant="tilt3d">
        {eyebrow && (
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            {eyebrow}
          </p>
        )}
        <h1 className="heading grad-text">{title}</h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={70} variant="tilt3d">
          <p className="subheading">{subtitle}</p>
        </Reveal>
      )}
    </header>
  );
}

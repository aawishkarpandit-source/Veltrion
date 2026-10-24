import { useAsync } from '../../lib/hooks';
import { getTextBlocks, getWhyPoints } from '../../lib/content';
import Reveal from '../ui/Reveal';

export default function WhyVeltrion() {
  const { data: points } = useAsync(() => getWhyPoints(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <section className="section section-wash">
      <div className="section-inner">
        <Reveal className="statement">
          <h2 className="heading">{blocks?.['why.title'] ?? 'Why Veltrion.'}</h2>
          <p className="subheading">{blocks?.['why.statement'] ?? 'Precision. Reliability. Simplicity. Professionalism.'}</p>
        </Reveal>

        <div className="grid-3" style={{ marginTop: 'var(--spacing-56)' }}>
          {(points ?? []).map((point, i) => (
            <Reveal key={point.id} delay={(i % 3) * 70}>
              <article className="card">
                <h3 className="card-title">{point.title}</h3>
                <p className="card-desc">{point.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

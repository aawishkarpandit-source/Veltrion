import { useAsync } from '../../lib/hooks';
import { getServices, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';

export default function ServiceGrid() {
  const { data: services } = useAsync(() => getServices(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <section className="section section-wash">
      <div className="section-inner">
        <Reveal className="section-head">
          <h2 className="heading">{blocks?.['services.title'] ?? 'What we do.'}</h2>
          {blocks?.['services.subtitle'] && <p className="subheading">{blocks['services.subtitle']}</p>}
        </Reveal>

        <div className="grid-3">
          {(services ?? []).map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 70}>
              <article className="card">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-desc">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useAsync } from '../../lib/hooks';
import { getServices, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';
import TiltCard from '../ui/TiltCard';

export default function ServiceGrid() {
  const { data: services } = useAsync(() => getServices(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <section className="section section-wash">
      <div className="section-inner">
        <Reveal className="section-head" variant="tilt3d">
          <p className="eyebrow">What we do</p>
          <h2 className="heading">{blocks?.['services.title'] ?? 'What we do.'}</h2>
          {blocks?.['services.subtitle'] && <p className="subheading">{blocks['services.subtitle']}</p>}
        </Reveal>

        <div className="grid-3">
          {(services ?? []).map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 70} variant="tilt3d">
              <TiltCard>
                <span className="card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-desc">{service.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

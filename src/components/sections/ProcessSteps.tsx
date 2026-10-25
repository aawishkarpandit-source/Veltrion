import { useAsync } from '../../lib/hooks';
import { getProcess, getProcessBullets, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';
import { CheckIcon } from '../ui/icons';
import TiltCard from '../ui/TiltCard';

export default function ProcessSteps() {
  const { data: steps } = useAsync(() => getProcess(), []);
  const { data: bullets } = useAsync(() => getProcessBullets(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <section className="section section-canvas">
      <div className="section-inner">
        <Reveal className="section-head" variant="tilt3d">
          <p className="eyebrow">How we work</p>
          <h2 className="heading">{blocks?.['process.title'] ?? 'How we work.'}</h2>
          {blocks?.['process.subtitle'] && <p className="subheading">{blocks['process.subtitle']}</p>}
        </Reveal>

        <ol className="grid-4">
          {(steps ?? []).map((step, i) => (
            <li key={step.id}>
              <Reveal delay={(i % 4) * 70} variant="tilt3d">
              <TiltCard>
                <span className="card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="step">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>

        {(bullets ?? []).length > 0 && (
          <Reveal delay={120}>
            <ul className="checklist">
              {(bullets ?? []).map((bullet) => (
                <li key={bullet.id}>
                  <CheckIcon size={16} />
                  <span>{bullet.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

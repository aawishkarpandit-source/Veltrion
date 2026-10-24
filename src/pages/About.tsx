import { useAsync } from '../lib/hooks';
import { getTextBlocks } from '../lib/content';
import Reveal from '../components/ui/Reveal';
import TeamGrid from '../components/sections/TeamGrid';

export default function About() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <>
      <header className="page-intro">
        <Reveal>
          <h1 className="heading">About Us.</h1>
        </Reveal>
        <Reveal delay={70}>
          <p className="subheading">{blocks?.['about.intro'] ?? ''}</p>
        </Reveal>
      </header>

      <section className="section section-wash">
        <div className="section-inner">
          <Reveal className="statement">
            <h2 className="heading-sm">Our vision &amp; mission.</h2>
            <div className="pair">
              <div>
                <h3>{blocks?.['about.vision_title'] ?? ''}</h3>
                <p>{blocks?.['about.vision_text'] ?? ''}</p>
              </div>
              <div>
                <h3>{blocks?.['about.mission_title'] ?? ''}</h3>
                <p>{blocks?.['about.mission_text'] ?? ''}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TeamGrid />

      <section className="section section-canvas">
        <div className="section-inner">
          <Reveal className="section-head">
            <h2 className="heading">{blocks?.['about.who_title'] ?? 'Who we work with.'}</h2>
          </Reveal>
          <Reveal delay={70}>
            <div className="about-prose">
              <p>{blocks?.['about.who_text'] ?? ''}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

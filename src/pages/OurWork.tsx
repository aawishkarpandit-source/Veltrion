import { useAsync } from '../lib/hooks';
import { getTextBlocks } from '../lib/content';
import Reveal from '../components/ui/Reveal';
import ProjectsGrid from '../components/sections/ProjectsGrid';

export default function OurWork() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <>
      <header className="page-intro">
        <Reveal>
          <h1 className="heading">{blocks?.['work.title'] ?? 'Our work.'}</h1>
        </Reveal>
        <Reveal delay={70}>
          <p className="subheading">{blocks?.['work.subtitle'] ?? ''}</p>
        </Reveal>
      </header>
      <ProjectsGrid />
    </>
  );
}

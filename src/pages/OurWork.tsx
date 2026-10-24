import { useAsync } from '../lib/hooks';
import { getTextBlocks } from '../lib/content';
import PageHeader from '../components/sections/PageHeader';
import ProjectsGrid from '../components/sections/ProjectsGrid';
import PageSections from '../components/layout/PageSections';

export default function OurWork() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  const sections = {
    projects: <ProjectsGrid />,
  };

  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title={blocks?.['work.title'] ?? 'Our work.'}
        subtitle={blocks?.['work.subtitle'] ?? ''}
      />
      <PageSections page="work" sections={sections} />
    </>
  );
}

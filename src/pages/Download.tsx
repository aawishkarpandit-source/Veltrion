import { useAsync } from '../lib/hooks';
import { getTextBlocks } from '../lib/content';
import PageHeader from '../components/sections/PageHeader';
import DownloadsGrid from '../components/sections/DownloadsGrid';
import PageSections from '../components/layout/PageSections';

export default function Download() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  const sections = {
    downloads: <DownloadsGrid />,
  };

  return (
    <>
      <PageHeader
        eyebrow="Download"
        title={blocks?.['download.title'] ?? 'Loading....'}
        subtitle={blocks?.['download.subtitle'] ?? 'Loading....'}
      />
      <PageSections page="download" sections={sections} />
    </>
  );
}

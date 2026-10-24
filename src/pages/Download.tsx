import { useAsync } from '../lib/hooks';
import { getTextBlocks } from '../lib/content';
import Reveal from '../components/ui/Reveal';
import DownloadsGrid from '../components/sections/DownloadsGrid';

export default function Download() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <>
      <header className="page-intro">
        <Reveal>
          <h1 className="heading">{blocks?.['download.title'] ?? 'Download.'}</h1>
        </Reveal>
        <Reveal delay={70}>
          <p className="subheading">{blocks?.['download.subtitle'] ?? ''}</p>
        </Reveal>
      </header>
      <DownloadsGrid />
    </>
  );
}

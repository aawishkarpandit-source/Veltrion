import { Link } from 'react-router-dom';
import { useAsync } from '../../lib/hooks';
import { getDownloads, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';
import { ArrowIcon } from '../ui/icons';

export default function DownloadsGrid() {
  const { data: downloads } = useAsync(() => getDownloads(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const list = [...(downloads ?? [])].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <section className="section section-canvas">
      <div className="section-inner">
        {list.length === 0 ? (
          <Reveal className="empty-state">
            <h2 className="heading-sm">{blocks?.['download.empty_title'] ?? 'Our first releases are being prepared.'}</h2>
            <p>{blocks?.['download.empty_text'] ?? ''}</p>
            <Link to="/contact" className="btn btn-filled">
              Contact us
            </Link>
          </Reveal>
        ) : (
          <div className="grid-2">
            {list.map((item, i) => (
              <Reveal key={item.id} delay={(i % 2) * 70}>
                <article className="card">
                  {item.cover_url && (
                    <div className="project-media">
                      <img className="product-shot" src={item.cover_url} alt={item.name} loading="lazy" />
                    </div>
                  )}
                  <h2 className="project-client">{item.name}</h2>
                  <div className="download-meta">
                    {item.platforms?.map((platform) => (
                      <span key={platform} className="tag">
                        {platform}
                      </span>
                    ))}
                    {item.version && <span>v{item.version}</span>}
                    {item.size && <span>{item.size}</span>}
                  </div>
                  {item.short_desc && <p className="project-desc">{item.short_desc}</p>}
                  {item.long_desc && <p className="project-desc">{item.long_desc}</p>}
                  {item.download_url && (
                    <div className="download-actions">
                      <a
                        href={item.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-filled btn-sm"
                      >
                        Download <ArrowIcon />
                      </a>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

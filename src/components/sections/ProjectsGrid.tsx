import { Link } from 'react-router-dom';
import { useAsync } from '../../lib/hooks';
import { getProjects, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';
import { ExternalIcon } from '../ui/icons';

export default function ProjectsGrid() {
  const { data: projects } = useAsync(() => getProjects(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const list = projects ?? [];

  return (
    <section className="section section-canvas">
      <div className="section-inner">
        {list.length === 0 ? (
          <Reveal className="empty-state">
            <h2 className="heading-sm">{blocks?.['work.empty_title'] ?? 'New projects are on the way.'}</h2>
            <p>{blocks?.['work.empty_text'] ?? ''}</p>
            <Link to="/contact" className="btn btn-filled">
              Contact us
            </Link>
          </Reveal>
        ) : (
          <div className="grid-2">
            {list.map((project, i) => (
              <Reveal key={project.id} delay={(i % 2) * 70}>
                <article className="card">
                  {project.image_url && (
                    <div className="project-media">
                      <img
                        className="product-shot"
                        src={project.image_url}
                        alt={project.client_name}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h2 className="project-client">{project.client_name}</h2>
                  {project.description && <p className="project-desc">{project.description}</p>}
                  {project.tech_tags?.length > 0 && (
                    <div className="tags">
                      {project.tech_tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.site_url && (
                    <a
                      href={project.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      Visit their site <ExternalIcon />
                    </a>
                  )}
                  {project.review_quote && (
                    <figure className="review">
                      <blockquote>“{project.review_quote}”</blockquote>
                      {project.review_author && (
                        <cite>
                          {project.review_author}
                          {project.review_role ? ` — ${project.review_role}` : ''}
                        </cite>
                      )}
                    </figure>
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

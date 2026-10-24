import { Link } from 'react-router-dom';
import { useAsync } from '../../lib/hooks';
import { getNavItems, getSettings } from '../../lib/content';

function currentYear(): string {
  return String(new Date().getFullYear());
}

export default function Footer() {
  const { data: settings } = useAsync(() => getSettings(), []);
  const { data: footerItems } = useAsync(() => getNavItems('footer'), []);

  // Until the admin adds dedicated footer links, mirror the main navigation.
  const { data: navItems } = useAsync(() => getNavItems('nav'), []);
  const links = footerItems && footerItems.length > 0 ? footerItems : (navItems ?? []);

  const groups = new Map<string, typeof links>();
  for (const item of links) {
    const key = item.group || 'links';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  const isInternal = (href: string) => href.startsWith('/');

  const groupTitle = (group: string) => (group === 'links' || group === 'main' ? 'Explore' : group);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="footer-wordmark" aria-label="VELTRION — home">
          VELTRION
        </Link>

        <div className="footer-cols">
          {Array.from(groups.entries()).map(([group, groupLinks]) => (
            <div key={group} className="footer-col">
              <h2 className="footer-col-title">{groupTitle(group)}</h2>
              {groupLinks.map((item) =>
                isInternal(item.href) ? (
                  <Link key={item.id} to={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ),
              )}
            </div>
          ))}

          {(settings?.social_links ?? []).length > 0 && (
            <div className="footer-col">
              <h2 className="footer-col-title">Follow</h2>
              {settings!.social_links.map((social) => (
                <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer-legal">
          <span>
            © {currentYear()} {settings?.brand_name ?? 'VELTRION'}.{' '}
            {settings?.footer_legal ?? 'Software & Digital Technology.'}
          </span>
          <span>{settings?.tagline ?? "Engineered for What's Next."}</span>
        </div>
      </div>
    </footer>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAsync, useTheme } from '../../lib/hooks';
import { getNavItems, getSettings } from '../../lib/content';
import { gsap, useScrollScene } from '../../lib/motion';

function currentYear(): string {
  return String(new Date().getFullYear());
}

export default function Footer() {
  const { theme } = useTheme();
  const { data: settings } = useAsync(() => getSettings(), []);
  const { data: footerItems } = useAsync(() => getNavItems('footer'), []);
  const footerRef = useRef<HTMLElement>(null);
  const dark = theme === 'dark';

  // 3D wordmark: levels out of a perspective tilt as it scrolls into view.
  useScrollScene(footerRef, (_ctx, reduced) => {
    if (reduced) return;
    gsap.fromTo(
      '.footer-wordmark',
      { rotateX: 26, y: 30, opacity: 0.3, transformOrigin: 'center bottom' },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: footerRef.current, start: 'top 92%', end: 'bottom bottom', scrub: 0.8 },
      },
    );
  });

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
    <footer ref={footerRef} className="footer">
      <div className="footer-inner">
        <div className="footer-mark">
          <Link to="/" className="footer-wordmark" aria-label="VELTRION — home">
            <img
              src={dark ? '/logo/brand-dark.png' : '/logo/brand-light.png'}
              alt="VELTRION"
            />
          </Link>
        </div>

        <div className="footer-cols">
          {Array.from(groups.entries()).map(([group, groupLinks]) => (
            <div key={group} className="footer-col">
              <h2 className="footer-col-title">{groupTitle(group)}</h2>
              {groupLinks.map((item) =>
                isInternal(item.href) ? (
                  <Link key={item.id} to={item.href} onClick={(e) => {
        e.preventDefault();
        window.location.href = item.href;
      }}>
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

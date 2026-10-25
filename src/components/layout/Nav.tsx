import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAsync, useTheme } from '../../lib/hooks';
import { getNavItems } from '../../lib/content';
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from '../ui/icons';

export default function Nav() {
  const { theme, toggle } = useTheme();
  const { data: items } = useAsync(() => getNavItems('nav'), []);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = theme === 'dark';

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="VELTRION — home">
          <img
            className="nav-logo"
            src={dark ? '/logo/brand-dark.png' : '/logo/brand-light.png'}
            alt="VELTRION"
          />
        </Link>

        <nav className="nav-links" aria-label="Main">
          {(items ?? []).map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className="nav-link" onClick={(e) => {
        e.preventDefault();
        window.location.href = item.href;
      }}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => {
             toggle();
              window.location.reload();
            }}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="menu-panel menu-fade" aria-label="Mobile">
          {(items ?? []).map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

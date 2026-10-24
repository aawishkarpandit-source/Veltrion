import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ShaderBackdrop from '../ui/ShaderBackdrop';
import { useAsync } from '../../lib/hooks';
import { getSettings } from '../../lib/content';

function ThemeDefaults() {
  // A stored visitor choice always wins; otherwise the admin's default applies.
  const { data: settings } = useAsync(() => getSettings(), []);
  useEffect(() => {
    if (!settings) return;
    if (localStorage.getItem('veltrion-theme')) return;
    if (settings.default_theme === 'light' || settings.default_theme === 'dark') {
      document.documentElement.setAttribute('data-theme', settings.default_theme);
    }
  }, [settings]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ThemeDefaults />
      <ShaderBackdrop />
      <Nav />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'veltrion-cookie-choice';

/**
 * Cookie notice. This site has no tracking/advertising cookies — only a theme
 * preference, the notice choice itself, and an admin session for our team —
 * so a slim, honest accept banner is all that's required. Shown once per
 * browser until accepted.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(STORAGE_KEY);
    } catch {
      choice = null;
    }
    // Small delay so it never competes with first paint / reveals.
    const timer = window.setTimeout(() => {
      if (choice !== 'ok') setVisible(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'ok');
    } catch {
      // Storage unavailable — accept in-memory so the banner still closes.
    }
    setVisible(false);
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p className="cookie-banner-text">
        We only use functional storage: your light/dark theme choice, this notice, and a session
        cookie if you're on our admin team. <strong>No tracking or advertising cookies.</strong>{' '}
        Details in our <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <button type="button" className="btn btn-filled" onClick={accept} autoFocus>
        OK
      </button>
    </div>
  );
}

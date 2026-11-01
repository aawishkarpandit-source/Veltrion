import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [accepted, setAccepted] = useState(() => {
    // Check if already accepted
    const stored = localStorage.getItem('vp_cookie_accepted');
    return stored === 'true';
  });

  // Show banner on first visit (no cookie set)
  useEffect(() => {
    const hasSeen = localStorage.getItem('vp_cookie_accepted');
    if (!hasSeen) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    setShowBanner(false);
    localStorage.setItem('vp_cookie_accepted', 'true');
  };

  const handleDecline = () => {
    setAccepted(false);
    setShowBanner(false);
    localStorage.setItem('vp_cookie_accepted', 'false');
  };

  if (accepted) {
    return null; // Don't show if already accepted
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 dark:bg-gray-800" aria-live="polite">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5L2 12zM2 12l10 5 10-5L2 7z" />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            We use cookies to improve your experience on our website. {accepted ? 'Accept' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAccept}
            className="abtn abtn-primary text-sm"
            style={{ padding: '6px 12px' }}
          >
            Accept
          </button>
          <button onClick={handleDecline} className="text-sm">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
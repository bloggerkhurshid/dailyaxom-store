import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Fire PageView event on every route change
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
}

// Google Analytics 4 (gtag.js) Integration for Green Gardan SPA

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Ensures gtag is initialized and configures the tracking ID.
 */
export function initGoogleAnalytics(measurementId: string = 'G-NVBMLP15K0'): void {
  if (typeof window === 'undefined') return;

  const cleanId = measurementId?.trim() || 'G-NVBMLP15K0';
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  // Check if GTM script tag exists; if not, inject it
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanId)}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
  }

  // Configure Measurement ID without duplicate auto page_view (since SPA tracks explicitly)
  window.gtag('config', cleanId, {
    send_page_view: false,
    cookie_flags: 'SameSite=None;Secure'
  });
}

/**
 * Fires a real-time page_view event on route transitions in Single Page App.
 */
export function trackPageView(
  path: string,
  title?: string,
  measurementId: string = 'G-NVBMLP15K0'
): void {
  if (typeof window === 'undefined') return;

  const cleanId = measurementId?.trim() || 'G-NVBMLP15K0';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const currentTitle = title || document.title || 'Green Gardan';
  const origin = window.location.origin || 'https://greengardan.co.uk';
  const pageLocation = `${origin}${cleanPath}`;

  // Make sure gtag exists
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: currentTitle,
      page_location: pageLocation,
      page_path: cleanPath,
      send_to: cleanId
    });
  } else if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_title: currentTitle,
      page_location: pageLocation,
      page_path: cleanPath,
      send_to: cleanId
    });
  }
}

/**
 * Track user interaction events (e.g. newsletter subscribe, social share, search).
 */
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
  measurementId: string = 'G-NVBMLP15K0'
): void {
  if (typeof window === 'undefined') return;
  const cleanId = measurementId?.trim() || 'G-NVBMLP15K0';

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      send_to: cleanId
    });
  } else if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
      send_to: cleanId
    });
  }
}

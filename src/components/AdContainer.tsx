import React, { useEffect, useRef } from 'react';
import { useBlog } from '../context/BlogContext';
import { initialAdUnits } from '../data/settings';
import { AdPlacement, AdUnit } from '../types';

interface AdContainerProps {
  placement: AdPlacement;
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ placement, className = '' }) => {
  const { adUnits } = useBlog();
  const adSlotRef = useRef<HTMLDivElement>(null);

  // Match in adUnits, fallback to initialAdUnits, or create default unit
  const matchedAd = adUnits.find(u => u.placement === placement);
  const fallbackAd = initialAdUnits.find(u => u.placement === placement);

  const activeAd: AdUnit = matchedAd || fallbackAd || {
    id: `ad-${placement}`,
    name: placement.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    slotId: '',
    format: 'responsive',
    placement: placement,
    device: 'all',
    status: 'active',
    customLabel: 'Advertisement'
  };

  // If user disabled ad unit, return null
  if (matchedAd && matchedAd.status === 'disabled') {
    return null;
  }

  // Check if running on live production domain
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'greengardan.co.uk' || window.location.hostname === 'www.greengardan.co.uk');

  useEffect(() => {
    // 1. If running on production, queue Ezoic showAds
    if (typeof window !== 'undefined' && isProduction) {
      window.ezstandalone = window.ezstandalone || {};
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
      window.ezstandalone.cmd.push(function () {
        if (typeof window.ezstandalone?.showAds === 'function') {
          try {
            window.ezstandalone.showAds({});
          } catch {
            // Non-blocking in dev
          }
        }
      });
    }

    // 2. Append physical <script> tag into the ad placement container DOM on production
    if (isProduction) {
      const container = adSlotRef.current;
      if (container) {
        const existing = container.querySelector('script[data-ez-placement]');
        if (!existing) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.setAttribute('data-ez-placement', placement);
          script.text = `ezstandalone.cmd.push(function () { ezstandalone.showAds({}); });`;
          container.appendChild(script);
        }
      }
    }
  }, [placement, isProduction]);

  // Per Ezoic compliance: do not render visible empty ad placeholder boxes when no ad is served
  return (
    <div 
      className={`mx-auto w-full max-w-4xl text-center overflow-hidden transition-all empty:hidden ${className}`}
      data-ad-placement={placement}
    >
      {/* Ezoic Ad Placement Container - collapsed until Ezoic fills it */}
      <div 
        ref={adSlotRef}
        id={`ez-ad-${placement}`}
        className="ezoic-ad w-full flex items-center justify-center min-h-0 empty:hidden"
      />
    </div>
  );
};

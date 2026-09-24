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

  // Only hide if the ad unit is explicitly marked as disabled by the user
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

    // 2. Append the physical <script> tag into the ad placement container DOM
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
  }, [placement, isProduction]);

  const label = activeAd.customLabel || activeAd.label || 'Advertisement';

  return (
    <div 
      className={`my-6 mx-auto w-full max-w-4xl text-center overflow-hidden transition-all ${className}`}
      data-ad-placement={placement}
    >
      {/* Editorial Compliance Label (FTC & UK ASA standard) */}
      <div className="text-[10px] sm:text-[11px] font-sans font-medium tracking-widest uppercase text-neutral-400/80 mb-1 select-none text-center">
        {label}
      </div>

      {/* Ezoic Ad Placement Container */}
      <div 
        ref={adSlotRef}
        id={`ez-ad-${placement}`}
        className="ezoic-ad border border-dashed border-neutral-300/80 bg-neutral-50/70 rounded-xl py-8 px-4 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[130px] md:min-h-[180px] my-1 relative transition-all text-center"
      >
        <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-neutral-400 select-none">
          Ad Placeholder
        </span>
      </div>
    </div>
  );
};

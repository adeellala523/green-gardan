import React from 'react';
import { useBlog } from '../context/BlogContext';
import { AdPlacement } from '../types';

interface AdContainerProps {
  placement: AdPlacement;
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ placement, className = '' }) => {
  const { adUnits, adsenseSettings } = useBlog();

  // Find active ad unit matching this placement
  const activeAd = adUnits.find(u => u.placement === placement && u.status === 'active');

  // If no ad is configured or active, return null to maintain clean layout without empty spaces
  if (!activeAd) {
    return null;
  }

  const isConfigured = Boolean(adsenseSettings.publisherId && activeAd.slotId);

  return (
    <div className={`my-6 mx-auto w-full max-w-4xl text-center overflow-hidden transition-all ${className}`}>
      <div className="text-[11px] tracking-wider uppercase text-neutral-400 font-sans mb-1 select-none">
        {activeAd.customLabel || 'Advertisement'}
      </div>

      {isConfigured ? (
        <div className="bg-neutral-50/50 border border-neutral-200/60 rounded-lg p-2 min-h-[90px] flex items-center justify-center">
          {/* Real Google AdSense Tag Container */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client={adsenseSettings.publisherId}
            data-ad-slot={activeAd.slotId}
            data-ad-format={activeAd.format === 'responsive' ? 'auto' : undefined}
            data-full-width-responsive={activeAd.format === 'responsive' ? 'true' : 'false'}
          />
        </div>
      ) : (
        /* AdSense Placeholder Preview (Visible only in Admin/Dev preview to verify placement) */
        <div className="border border-dashed border-[#c2d6c5] bg-[#f4f8f4]/60 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d6a4f]">
            <span className="w-2 h-2 rounded-full bg-[#40916c] animate-pulse"></span>
            Ad Unit Placement: {activeAd.name} ({activeAd.format})
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Ready for Google AdSense. Enter your Publisher ID and Slot ID in the Admin Panel to display live ads.
          </p>
        </div>
      )}
    </div>
  );
};

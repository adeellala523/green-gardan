import React, { useState } from 'react';
import { DollarSign, Check, Info, FileText, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

export const AdminAdSense: React.FC = () => {
  const { adsenseSettings, updateAdSenseSettings } = useBlog();

  const [publisherId, setPublisherId] = useState(adsenseSettings.publisherId);
  const [verificationCode, setVerificationCode] = useState(adsenseSettings.verificationCode);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(adsenseSettings.autoAdsEnabled);
  const [adsTxtContent, setAdsTxtContent] = useState(adsenseSettings.adsTxtContent);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdSenseSettings({
      publisherId: publisherId.trim(),
      verificationCode: verificationCode.trim(),
      autoAdsEnabled,
      adsTxtContent
    });
    setSavedMsg('Google AdSense settings and ads.txt updated successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          Google AdSense &amp; Ads.txt Management
        </h2>
        <p className="text-xs text-[#52796f]">
          Manage your AdSense Publisher ID, site verification meta tags, and public ads.txt records without editing source code.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-[#40916c]" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Policy & AdSense Guidance Note */}
      <div className="p-5 rounded-2xl bg-[#f4f8f4] border border-[#cbe1ce] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
        <div className="text-xs text-[#2e4736] leading-relaxed">
          <span className="font-bold text-[#1b4332]">Google AdSense Publisher Policy Guidelines:</span>
          <p className="mt-1">
            Green Garden is pre-configured for Google AdSense compliance: clean editorial typography, full legal privacy notices (UK GDPR), non-intrusive placements, zero fake download buttons, and distinct "Advertisement" labelling. Once your AdSense application is reviewed, enter your Publisher ID below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Credentials Card */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <DollarSign className="w-5 h-5 text-[#2d6a4f]" />
            <h3 className="text-base font-bold font-editorial text-[#14281c]">
              AdSense Account Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                AdSense Publisher ID (Client ID)
              </label>
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono text-[#1b4332] focus:ring-2 focus:ring-[#2d6a4f]"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Found in your Google AdSense account under <strong>Account &gt; Settings &gt; Account Information</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Site Verification Tag (&lt;head&gt; code)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder='<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">'
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono text-neutral-700 focus:ring-2 focus:ring-[#2d6a4f]"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Paste the verification meta tag provided by AdSense during domain ownership check.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-700 block">Google Auto Ads</span>
              <span className="text-[11px] text-neutral-500">Allow Google to automatically place responsive in-page ads where appropriate.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdsEnabled}
                onChange={(e) => setAutoAdsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b4332]"></div>
            </label>
          </div>
        </div>

        {/* Ads.txt Manager */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2d6a4f]" />
              <div>
                <h3 className="text-base font-bold font-editorial text-[#14281c]">
                  Public ads.txt Editor
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Accessible publicly at <code>/ads.txt</code> to protect your ad inventory.
                </p>
              </div>
            </div>

            <a
              href="/ads-txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2d6a4f] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Public /ads.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <textarea
              rows={5}
              value={adsTxtContent}
              onChange={(e) => setAdsTxtContent(e.target.value)}
              className="w-full p-4 rounded-xl border border-neutral-300 font-mono text-xs text-neutral-800 bg-neutral-50/50 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Standard format: <code>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code>
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Save AdSense &amp; Ads.txt Settings
          </button>
        </div>
      </form>
    </div>
  );
};

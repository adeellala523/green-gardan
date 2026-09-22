import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';

interface AdsTxtViewProps {
  navigate?: (path: string) => void;
}

export const AdsTxtView: React.FC<AdsTxtViewProps> = ({ navigate }) => {
  const { adsenseSettings } = useBlog();
  const [copied, setCopied] = useState(false);

  const text = adsenseSettings.adsTxtContent || 'google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0';

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 p-4 sm:p-8 font-mono text-sm">
      <div className="mb-4 pb-2 border-b border-neutral-200 flex justify-between items-center text-xs font-sans text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold text-neutral-800">/ads.txt</span>
          <button 
            onClick={copyText} 
            className="text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy text'}
          </button>
        </div>
        {navigate && (
          <button
            onClick={() => navigate('/')}
            className="text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
          >
            ← Return to Green Garden
          </button>
        )}
      </div>

      <pre className="whitespace-pre-wrap select-all font-mono text-sm leading-relaxed text-neutral-900 bg-transparent m-0 font-normal">
        {text}
      </pre>
    </div>
  );
};

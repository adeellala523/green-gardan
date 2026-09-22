import React from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const AdsTxtView: React.FC = () => {
  const { adsenseSettings } = useBlog();
  const [copied, setCopied] = React.useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(adsenseSettings.adsTxtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2d6a4f]" />
            <h1 className="text-lg font-bold font-editorial text-[#14281c]">
              Public ads.txt
            </h1>
          </div>
          <button
            onClick={copyText}
            className="px-3 py-1.5 rounded-lg bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          This record identifies authorized sellers of advertising space on Green Garden to combat ad fraud.
        </p>

        <pre className="p-4 bg-neutral-900 rounded-xl text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
          {adsenseSettings.adsTxtContent}
        </pre>
      </div>
    </div>
  );
};

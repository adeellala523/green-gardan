import React, { useState } from 'react';
import { FileText, Copy, Check, Download } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const RobotsView: React.FC = () => {
  const { siteSettings } = useBlog();
  const [copied, setCopied] = useState(false);

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

# Sitemap location
Sitemap: ${siteSettings.canonicalBaseUrl || 'https://greengarden.co.uk'}/sitemap.xml
`;

  const copyText = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadRobots = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2d6a4f]" />
            <h1 className="text-lg font-bold font-editorial text-[#14281c]">
              /robots.txt
            </h1>
            <span className="text-[11px] font-mono bg-[#edf4ed] text-[#1b4332] px-2 py-0.5 rounded-md">
              Live crawler endpoint
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadRobots}
              className="px-3 py-1.5 rounded-lg border border-[#cde2cf] bg-white hover:bg-[#edf5ee] text-[#1b4332] text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Download robots.txt</span>
            </button>
            <button
              onClick={copyText}
              className="px-3 py-1.5 rounded-lg bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          Standard instructions for search engine web crawlers (Googlebot, Bingbot). Accessible publicly at <code className="font-mono text-emerald-800 bg-[#edf5ee] px-1 py-0.5 rounded">/robots.txt</code>.
        </p>

        <pre className="p-4 bg-neutral-900 rounded-xl text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
          {robotsTxt}
        </pre>
      </div>
    </div>
  );
};

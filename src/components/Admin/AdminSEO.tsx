import React, { useState } from 'react';
import { Search, Check, Globe, FileCode, ExternalLink, ShieldCheck, Eye } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

export const AdminSEO: React.FC = () => {
  const { siteSettings, updateSiteSettings, articles, categories } = useBlog();

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [siteDescription, setSiteDescription] = useState(siteSettings.siteDescription);
  const [googleVerification, setGoogleVerification] = useState(siteSettings.googleVerificationCode || siteSettings.googleSiteVerification || '');
  const [canonicalBase, setCanonicalBase] = useState(siteSettings.canonicalBaseUrl || 'https://greengarden.co.uk');
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName: siteName.trim(),
      siteDescription: siteDescription.trim(),
      googleVerificationCode: googleVerification.trim(),
      googleSiteVerification: googleVerification.trim(),
      canonicalBaseUrl: canonicalBase.trim()
    });
    setMsg('SEO configuration updated successfully!');
    setTimeout(() => setMsg(''), 4000);
  };

  // Generate dynamic XML sitemap string
  const publishedArticles = articles.filter(a => a.status === 'published');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${canonicalBase}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Categories -->
${categories.map(c => `  <url>
    <loc>${canonicalBase}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <!-- Articles (${publishedArticles.length} guides) -->
${publishedArticles.map(a => `  <url>
    <loc>${canonicalBase}/${a.categorySlug}/${a.slug}</loc>
    <lastmod>${a.updatedDate || a.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          Search Engine Optimization (SEO) &amp; Sitemaps
        </h2>
        <p className="text-xs text-[#52796f]">
          Fine-tune title tags, search console ownership, XML sitemaps, and robots.txt.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#40916c]" />
          <span>{msg}</span>
        </div>
      )}

      {/* SEO Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Search className="w-5 h-5 text-[#2d6a4f]" />
          <h3 className="text-base font-bold font-editorial text-[#14281c]">
            Global Metadata &amp; Search Console
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Publication Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Canonical Base Domain URL
            </label>
            <input
              type="url"
              value={canonicalBase}
              onChange={(e) => setCanonicalBase(e.target.value)}
              placeholder="https://greengarden.co.uk"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-2 focus:ring-[#2d6a4f]"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Used in XML sitemap and canonical links for your live domain on Hostinger.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Global Meta Description
          </label>
          <textarea
            rows={2}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d6a4f]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Google Search Console Verification Token
          </label>
          <input
            type="text"
            value={googleVerification}
            onChange={(e) => setGoogleVerification(e.target.value)}
            placeholder="e.g. AbC123XyZ-verification-token"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono"
          />
          <p className="text-[11px] text-neutral-400 mt-1">
            Injected automatically into the &lt;head&gt; tag as <code>&lt;meta name="google-site-verification" content="..."&gt;</code>.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Save Global SEO
          </button>
        </div>
      </form>

      {/* XML Sitemap Live Preview */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#2d6a4f]" />
            <div>
              <h3 className="text-base font-bold font-editorial text-[#14281c]">
                Dynamic XML Sitemap Preview
              </h3>
              <p className="text-[11px] text-neutral-400">
                Includes {publishedArticles.length} published articles and {categories.length} categories.
              </p>
            </div>
          </div>

          <a
            href="/sitemap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2d6a4f] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View Public /sitemap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto max-h-72">
          <pre className="text-[11px] font-mono text-emerald-400 leading-tight">
            {sitemapXml}
          </pre>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileCode, Globe, Layers, BookOpen, ExternalLink, Copy, Check, Download } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

interface SitemapViewProps {
  navigate: (path: string) => void;
  initialTab?: 'visual' | 'xml';
}

export const SitemapView: React.FC<SitemapViewProps> = ({ navigate, initialTab = 'xml' }) => {
  const { articles, categories, staticPages, siteSettings } = useBlog();
  const [tab, setTab] = useState<'visual' | 'xml'>(initialTab);
  const [copied, setCopied] = useState(false);

  const publishedArticles = articles.filter(a => a.status === 'published');
  const baseUrl = siteSettings.canonicalBaseUrl || 'https://greengarden.co.uk';
  const pagesList = Object.values(staticPages);

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Main Categories -->
${categories.map(c => `  <url>
    <loc>${baseUrl}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <!-- Trust & Legal Pages -->
${pagesList.map((p) => `  <url>
    <loc>${baseUrl}/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
  <!-- Gardening Articles (${publishedArticles.length} guides) -->
${publishedArticles.map(a => `  <url>
    <loc>${baseUrl}/${a.categorySlug}/${a.slug}</loc>
    <lastmod>${a.updatedDate || a.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  const copyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e5ebe4] pb-6 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">
            Search Engine Index
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#14281c]">
            Site Map &amp; XML Feed
          </h1>
          <p className="text-xs text-[#52796f] mt-1">
            Complete index of all {publishedArticles.length} UK gardening guides, categories, and legal pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('visual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'visual'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white border border-[#cde2cf] text-[#1b4332] hover:bg-[#edf5ee]'
            }`}
          >
            Visual Directory
          </button>
          <button
            onClick={() => setTab('xml')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'xml'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white border border-[#cde2cf] text-[#1b4332] hover:bg-[#edf5ee]'
            }`}
          >
            Raw XML Code
          </button>
        </div>
      </div>

      {tab === 'visual' ? (
        <div className="space-y-10">
          {/* Categories & Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold font-editorial text-[#14281c] mb-4">
                <Layers className="w-4 h-4 text-[#2d6a4f]" />
                <span>Primary Category Hubs</span>
              </div>
              <ul className="space-y-2 text-xs">
                {categories.map((c) => (
                  <li key={c.slug} className="flex justify-between items-center py-1 border-b border-neutral-50">
                    <button
                      onClick={() => navigate(`/${c.slug}`)}
                      className="text-[#2b4233] hover:text-[#1b4332] font-medium hover:underline text-left cursor-pointer"
                    >
                      {c.name}
                    </button>
                    <span className="text-neutral-400 font-mono text-[11px]">/{c.slug}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold font-editorial text-[#14281c] mb-4">
                <Globe className="w-4 h-4 text-[#2d6a4f]" />
                <span>Publication &amp; Legal Pages</span>
              </div>
              <ul className="space-y-2 text-xs">
                {pagesList.map((p) => (
                  <li key={p.slug} className="flex justify-between items-center py-1 border-b border-neutral-50">
                    <button
                      onClick={() => navigate(`/${p.slug}`)}
                      className="text-[#2b4233] hover:text-[#1b4332] font-medium hover:underline text-left cursor-pointer"
                    >
                      {p.title}
                    </button>
                    <span className="text-neutral-400 font-mono text-[11px]">/{p.slug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Articles Index Grouped by Category */}
          <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 text-base font-bold font-editorial text-[#14281c]">
              <BookOpen className="w-5 h-5 text-[#2d6a4f]" />
              <span>All Horticultural Guides ({publishedArticles.length})</span>
            </div>

            {categories.map((cat) => {
              const catArticles = publishedArticles.filter(a => a.categorySlug === cat.slug);
              if (catArticles.length === 0) return null;
              return (
                <div key={cat.slug} className="border-t border-neutral-100 pt-4 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#40916c]">
                    {cat.name} ({catArticles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {catArticles.map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
                        className="p-2 rounded-lg hover:bg-[#f6f9f6] text-xs text-[#2b4233] hover:text-[#1b4332] cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{art.title}</span>
                        <span className="text-[10px] text-neutral-400 shrink-0">{art.readingTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono">XML Sitemap (Standard Sitemaps.org Protocol: /sitemap.xml)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadXml}
                className="px-3.5 py-1.5 rounded-lg border border-[#cde2cf] bg-white hover:bg-[#edf5ee] text-[#1b4332] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Download sitemap.xml</span>
              </button>
              <button
                onClick={copyXml}
                className="px-3.5 py-1.5 rounded-lg bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 bg-neutral-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
            {xmlContent}
          </pre>
        </div>
      )}
    </div>
  );
};

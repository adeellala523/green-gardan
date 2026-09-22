import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';

interface SitemapViewProps {
  navigate: (path: string) => void;
  initialTab?: 'links' | 'xml';
}

export const SitemapView: React.FC<SitemapViewProps> = ({ navigate, initialTab = 'links' }) => {
  const { articles, categories, staticPages, siteSettings } = useBlog();
  const [tab, setTab] = useState<'links' | 'xml'>(initialTab);
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

  const copyContent = () => {
    if (tab === 'xml') {
      navigator.clipboard.writeText(xmlContent);
    } else {
      const allLinksText = publishedArticles
        .map(a => `${a.title}\n${baseUrl}/${a.categorySlug}/${a.slug}`)
        .join('\n\n');
      navigator.clipboard.writeText(allLinksText);
    }
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
    <div className="min-h-screen bg-white text-neutral-900 p-4 sm:p-8 font-sans">
      {/* Top minimal bar */}
      <div className="max-w-4xl mx-auto mb-6 pb-3 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-neutral-900 text-sm">/sitemap.xml</span>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-600 font-mono text-[11px]">{publishedArticles.length} Posts</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-300 p-0.5 bg-neutral-50 text-[11px]">
            <button
              onClick={() => setTab('links')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                tab === 'links'
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Post Links (Text)
            </button>
            <button
              onClick={() => setTab('xml')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                tab === 'xml'
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Raw XML Text
            </button>
          </div>

          <button
            onClick={copyContent}
            className="px-2.5 py-1 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-[11px] font-medium cursor-pointer transition-colors"
          >
            {copied ? 'Copied!' : tab === 'xml' ? 'Copy XML' : 'Copy All Links'}
          </button>

          {tab === 'xml' && (
            <button
              onClick={downloadXml}
              className="px-2.5 py-1 rounded-md bg-[#1b4332] text-white hover:bg-[#2d6a4f] text-[11px] font-medium cursor-pointer transition-colors"
            >
              Download
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="text-emerald-700 hover:text-emerald-900 hover:underline text-xs font-medium cursor-pointer ml-2"
          >
            ← Return to Green Garden
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {tab === 'links' ? (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h1 className="text-xl font-bold text-neutral-900 font-editorial">
                Sitemap Index - All Post Links
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Total articles: {publishedArticles.length} | Base URL: {baseUrl}
              </p>
            </div>

            {/* List of all articles */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Articles &amp; Posts ({publishedArticles.length})
              </h2>

              <ol className="divide-y divide-neutral-100 font-sans">
                {publishedArticles.map((article, index) => {
                  const postUrl = `${baseUrl}/${article.categorySlug}/${article.slug}`;
                  return (
                    <li key={article.id} className="py-2.5 flex flex-col gap-0.5">
                      <div className="text-sm font-semibold text-neutral-900">
                        <span className="text-neutral-400 font-mono text-xs mr-2">{index + 1}.</span>
                        {article.title}
                      </div>
                      <div className="font-mono text-xs">
                        <a
                          href={postUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${article.categorySlug}/${article.slug}`);
                          }}
                          className="text-emerald-700 hover:text-emerald-900 hover:underline break-all"
                        >
                          {postUrl}
                        </a>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Category: {article.categoryName} &bull; Date: {article.publishDate}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Categories Links */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Category Links ({categories.length})
              </h2>
              <ul className="divide-y divide-neutral-100 font-mono text-xs">
                {categories.map((cat) => {
                  const catUrl = `${baseUrl}/${cat.slug}`;
                  return (
                    <li key={cat.slug} className="py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-sans font-medium text-neutral-800">{cat.name}</span>
                      <a
                        href={catUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${cat.slug}`);
                        }}
                        className="text-emerald-700 hover:underline"
                      >
                        {catUrl}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Static Pages Links */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Site &amp; Policy Pages ({pagesList.length})
              </h2>
              <ul className="divide-y divide-neutral-100 font-mono text-xs">
                {pagesList.map((pg) => {
                  const pageUrl = `${baseUrl}/${pg.slug}`;
                  return (
                    <li key={pg.slug} className="py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-sans font-medium text-neutral-800">{pg.title}</span>
                      <a
                        href={pageUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${pg.slug}`);
                        }}
                        className="text-emerald-700 hover:underline"
                      >
                        {pageUrl}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-neutral-500 font-mono">
              Standard XML Sitemap protocol output. Accessible directly at <code className="text-emerald-800 bg-neutral-100 px-1 py-0.5 rounded">/sitemap.xml</code>
            </div>
            <pre className="p-4 bg-neutral-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre select-all">
              {xmlContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

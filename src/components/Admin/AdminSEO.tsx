import React, { useState } from 'react';
import { 
  Search, 
  Check, 
  Globe, 
  FileCode, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Download, 
  HelpCircle, 
  CheckCircle2, 
  Terminal,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Activity
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { trackPageView, trackEvent, initGoogleAnalytics } from '../../utils/analytics';

export const AdminSEO: React.FC = () => {
  const { siteSettings, updateSiteSettings, articles, categories } = useBlog();

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [siteDescription, setSiteDescription] = useState(siteSettings.siteDescription);
  const [googleVerification, setGoogleVerification] = useState(siteSettings.googleVerificationCode || siteSettings.googleSiteVerification || '');
  const [canonicalBase, setCanonicalBase] = useState(siteSettings.canonicalBaseUrl || 'https://greengardan.co.uk');
  const [googleHtmlFileName, setGoogleHtmlFileName] = useState(siteSettings.googleHtmlFileName || '');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(siteSettings.googleAnalyticsId || 'G-NVBMLP15K0');
  const [activeVerifyMethod, setActiveVerifyMethod] = useState<'meta_tag' | 'html_file' | 'dns'>('meta_tag');
  
  const [msg, setMsg] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testHitSent, setTestHitSent] = useState(false);

  // Clean token helper
  const extractCleanToken = (raw: string) => {
    const trimmed = raw.trim();
    const match = trimmed.match(/content=["']([^"']+)["']/i);
    return match ? match[1] : trimmed;
  };

  const cleanToken = extractCleanToken(googleVerification);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenToSave = extractCleanToken(googleVerification);
    const cleanGaId = googleAnalyticsId.trim().toUpperCase();

    updateSiteSettings({
      siteName: siteName.trim(),
      siteDescription: siteDescription.trim(),
      googleVerificationCode: tokenToSave,
      googleSiteVerification: tokenToSave,
      googleHtmlFileName: googleHtmlFileName.trim(),
      googleAnalyticsId: cleanGaId,
      canonicalBaseUrl: canonicalBase.trim().replace(/\/$/, '')
    });

    if (cleanGaId) {
      initGoogleAnalytics(cleanGaId);
    }

    setMsg('Google Analytics & Search Console SEO settings saved and active!');
    setTimeout(() => setMsg(''), 4500);
  };

  const handleSendTestHit = () => {
    const gaId = googleAnalyticsId.trim() || 'G-NVBMLP15K0';
    trackPageView(window.location.pathname, document.title, gaId);
    trackEvent('admin_test_hit', { source: 'AdminSEO_Panel', timestamp: new Date().toISOString() }, gaId);
    setTestHitSent(true);
    setTimeout(() => setTestHitSent(false), 5000);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const downloadVerificationHtmlFile = () => {
    const filename = googleHtmlFileName.trim() || `google${cleanToken || 'site-verification'}.html`;
    const content = `google-site-verification: ${filename}`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate dynamic XML sitemap string
  const publishedArticles = articles.filter(a => a.status === 'published');
  const sitemapUrl = `${canonicalBase}/sitemap.xml`;
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${canonicalBase}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Categories (${categories.length}) -->
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
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c] flex items-center gap-2.5">
          <Search className="w-6 h-6 text-[#2d6a4f]" />
          Google Search Console &amp; SEO Engine
        </h2>
        <p className="text-xs text-[#52796f] mt-1">
          Complete Google Search Console (GSC) domain ownership verification, XML Sitemap submission, and live meta indexing for <strong>{canonicalBase}</strong>.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] border border-[#a7d7b5] text-[#1b4332] text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* GSC Quick Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#e2ece2] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#52796f] font-medium">GSC Verification Status</span>
            {cleanToken ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" /> Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Pending Token
              </span>
            )}
          </div>
          <div className="text-sm font-bold font-mono text-[#14281c] mt-2 truncate">
            {cleanToken ? `Token: ${cleanToken.substring(0, 16)}...` : 'Not configured yet'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Injected in &lt;head&gt; via meta tag
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ece2] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#52796f] font-medium">Indexed Sitemap</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </div>
          <div className="text-sm font-bold font-mono text-[#14281c] mt-2 truncate">
            /sitemap.xml
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {publishedArticles.length} guides + {categories.length} categories ready
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2ece2] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#52796f] font-medium">Search Console Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2d6a4f]" />
          </div>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] hover:underline mt-2 inline-flex items-center gap-1.5"
          >
            Open Google Search Console ↗
          </a>
          <div className="text-[11px] text-neutral-400 mt-1">
            Submit sitemap.xml in GSC property
          </div>
        </div>
      </div>

      {/* Step-by-Step Google Search Console Integration Wizard */}
      <div className="bg-gradient-to-br from-[#f2f8f4] to-[#e8f4ec] rounded-2xl border border-[#c4e3cb] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2d6a4f]" />
            <h3 className="text-base font-bold font-editorial text-[#14281c]">
              How to Connect Green Gardan with Google Search Console (3 Simple Steps)
            </h3>
          </div>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Go to Search Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-white border border-[#d2e8d8] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span className="text-xs font-bold text-[#14281c]">Add Property in GSC</span>
            </div>
            <p className="text-[12px] text-[#3d5a45] leading-relaxed">
              Open <strong>search.google.com/search-console</strong>. Click <strong>Add Property</strong>, choose <strong>URL prefix</strong>, and enter:
            </p>
            <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono">
              <span className="truncate text-emerald-900">{canonicalBase}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(canonicalBase, 'url-prefix')}
                className="text-neutral-500 hover:text-neutral-900 ml-2"
                title="Copy URL"
              >
                {copiedField === 'url-prefix' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#d2e8d8] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span className="text-xs font-bold text-[#14281c]">Verify Ownership</span>
            </div>
            <p className="text-[12px] text-[#3d5a45] leading-relaxed">
              In Google Search Console, choose <strong>HTML tag</strong>. Copy the verification code (or entire meta tag) and paste it into the field below. Click <strong>Save Global SEO</strong>.
            </p>
            <p className="text-[11px] text-neutral-500 italic">
              Once saved, click "Verify" inside Google Search Console!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#d2e8d8] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span className="text-xs font-bold text-[#14281c]">Submit Sitemap</span>
            </div>
            <p className="text-[12px] text-[#3d5a45] leading-relaxed">
              In GSC sidebar, navigate to <strong>Sitemaps</strong>. In the "Add a new sitemap" box, type:
            </p>
            <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-900 font-bold">sitemap.xml</span>
              <button
                type="button"
                onClick={() => copyToClipboard('sitemap.xml', 'sitemap-xml')}
                className="text-neutral-500 hover:text-neutral-900 ml-2"
                title="Copy Sitemap Name"
              >
                {copiedField === 'sitemap-xml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Google will index all {publishedArticles.length} guides within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e2ece2] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2d6a4f]" />
            <h3 className="text-base font-bold font-editorial text-[#14281c]">
              Google Search Console Ownership Credentials
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Choose your preferred verification method from Google Search Console. Method 1 (HTML tag) is immediate and requires zero server file uploading.
          </p>
        </div>

        {/* Verification Method Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveVerifyMethod('meta_tag')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeVerifyMethod === 'meta_tag'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Method 1: HTML Meta Tag (Recommended &amp; Instant)
          </button>
          <button
            type="button"
            onClick={() => setActiveVerifyMethod('html_file')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeVerifyMethod === 'html_file'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Method 2: HTML Verification File (Hostinger Upload)
          </button>
          <button
            type="button"
            onClick={() => setActiveVerifyMethod('dns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeVerifyMethod === 'dns'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Method 3: Domain DNS Record
          </button>
        </div>

        {activeVerifyMethod === 'meta_tag' && (
          <div className="space-y-3 bg-[#f8faf8] p-4 rounded-xl border border-[#d8e6d8]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#14281c]">
                Google Search Console HTML Tag Verification Token
              </label>
              {cleanToken && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tag Injected in DOM
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={googleVerification}
                onChange={(e) => setGoogleVerification(e.target.value)}
                placeholder='e.g. AbC123XyZ_token or <meta name="google-site-verification" content="..." />'
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-2 focus:ring-[#2d6a4f] bg-white"
              />
              <p className="text-[11px] text-neutral-500">
                You can paste either the <strong>raw token code</strong> or the <strong>full meta tag snippet</strong> provided by Google Search Console. We will automatically parse and embed it as:
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-900 text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                <code>
                  &lt;meta name="google-site-verification" content="{cleanToken || 'YOUR_VERIFICATION_TOKEN'}" /&gt;
                </code>
                {cleanToken && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`<meta name="google-site-verification" content="${cleanToken}" />`, 'tag-snippet')}
                    className="text-neutral-400 hover:text-white ml-2"
                    title="Copy meta tag"
                  >
                    {copiedField === 'tag-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeVerifyMethod === 'html_file' && (
          <div className="space-y-4 bg-[#f8faf8] p-4 rounded-xl border border-[#d8e6d8]">
            <div>
              <label className="block text-xs font-bold text-[#14281c] mb-1">
                Google HTML Verification File Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={googleHtmlFileName}
                  onChange={(e) => setGoogleHtmlFileName(e.target.value)}
                  placeholder="e.g. google1a2b3c4d5e6f.html"
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs font-mono bg-white"
                />
                <button
                  type="button"
                  onClick={downloadVerificationHtmlFile}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white hover:bg-[#2d6a4f] text-xs font-bold shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html file</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Download this file and upload it into your Hostinger <strong>public_html/</strong> directory via File Manager.
              </p>
            </div>
          </div>
        )}

        {activeVerifyMethod === 'dns' && (
          <div className="space-y-2 bg-[#f8faf8] p-4 rounded-xl border border-[#d8e6d8] text-xs">
            <h4 className="font-bold text-[#14281c]">Domain DNS TXT Verification (Hostinger DNS Zone)</h4>
            <p className="text-neutral-600 leading-relaxed">
              If verifying the entire root domain (e.g. <code>greengardan.co.uk</code>):
            </p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-1">
              <li>Log in to <strong>Hostinger hPanel</strong> &gt; <strong>Domains</strong> &gt; <strong>DNS / Nameservers</strong>.</li>
              <li>Add a new <strong>TXT Record</strong> with:
                <ul className="list-disc list-inside pl-4 mt-1 text-neutral-600 font-mono text-[11px]">
                  <li>Name / Host: <code>@</code></li>
                  <li>TXT Value: <code>google-site-verification={cleanToken || 'YOUR_CODE'}</code></li>
                  <li>TTL: <code>14400</code></li>
                </ul>
              </li>
              <li>Wait 5–10 minutes for DNS propagation, then click "Verify" in Google Search Console.</li>
            </ol>
          </div>
        )}

        {/* Global Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
              placeholder="https://greengardan.co.uk"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-2 focus:ring-[#2d6a4f]"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Used in XML sitemap, canonical meta tags, and structured schema data.
            </p>
          </div>
        </div>

        {/* Google Analytics 4 (GA4) Configuration */}
        <div className="p-5 rounded-2xl bg-[#f4f9f5] border border-[#cde5d3] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1b4332] text-white flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14281c]">
                  Google Analytics 4 (GA4) Tracking
                </h4>
                <p className="text-[11px] text-[#406a4e]">
                  Linked to your Google Account (<span className="font-semibold text-[#1b4332]">harpalgeo670@gmail.com</span>)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-[#1b4332] text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SPA Real-time Tracking Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Google Analytics Measurement ID (Stream ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-NVBMLP15K0"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono font-bold text-[#1b4332] focus:ring-2 focus:ring-[#2d6a4f]"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(googleAnalyticsId, 'ga-id')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  title="Copy Measurement ID"
                >
                  {copiedField === 'ga-id' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Format: <code>G-XXXXXXXXXX</code>. Find this in <em>Google Analytics &rarr; Admin &rarr; Data Streams &rarr; Web Stream</em>.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSendTestHit}
                className="w-full py-2.5 px-4 rounded-xl border border-[#2d6a4f] bg-white hover:bg-[#edf5ee] text-[#1b4332] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{testHitSent ? '✓ Realtime Hit Sent!' : 'Send Test Realtime Hit'}</span>
              </button>
              <p className="text-[10px] text-neutral-400 text-center mt-1">
                Instant test for GA Realtime report
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#d6ebd9] text-[11px] text-[#33533c] space-y-2 leading-relaxed">
            <p className="font-bold text-[#14281c] flex items-center gap-1.5">
              <span>Why newly linked Google Analytics doesn't show in standard reports today:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-600">
              <li>
                <strong>24–48 Hour Processing Window:</strong> Google Analytics 4 (GA4) takes 24 to 48 hours to process and display visitors in standard reports (Overview, Traffic acquisition, Demographics).
              </li>
              <li>
                <strong>Check "Realtime" Tab:</strong> To verify right now, go to <strong>analytics.google.com &rarr; Reports &rarr; Realtime</strong>. When you open any page on your site or click "Send Test Realtime Hit", you will see your visit live on the world map within 10–30 seconds!
              </li>
              <li>
                <strong>Single-Page App (SPA) Tracking:</strong> We have configured automatic route-change tracking so every time a reader clicks any article or category, GA4 captures a verified <code>page_view</code> event.
              </li>
            </ol>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#1b4332] hover:underline"
              >
                <span>Open Google Analytics Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
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

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-xs text-neutral-400">
            Changes reflect instantly in the document head and XML sitemap endpoints.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            Save Google Search Console &amp; SEO
          </button>
        </div>
      </form>

      {/* XML Sitemap Live Preview & Search Console Submission */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#2d6a4f]" />
            <div>
              <h3 className="text-base font-bold font-editorial text-[#14281c]">
                Dynamic XML Sitemap for Google Search Console
              </h3>
              <p className="text-[11px] text-neutral-400">
                Sitemap URL: <code className="text-[#1b4332] font-semibold">{sitemapUrl}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(sitemapUrl, 'sitemap-url')}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedField === 'sitemap-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'sitemap-url' ? 'Copied Sitemap URL' : 'Copy Sitemap URL'}</span>
            </button>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#1b4332] hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>View /sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
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

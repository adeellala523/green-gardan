import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Download, 
  Filter, 
  Key, 
  Globe, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { Article, ArticleIndexingStatus } from '../../types';

export const AdminIndexingDashboard: React.FC = () => {
  const { 
    articles, 
    categories, 
    siteSettings, 
    indexingApiSettings, 
    updateIndexingApiSettings, 
    updateArticleIndexingStatus, 
    bulkUpdateArticleIndexingStatus, 
    pingGoogleIndexingApi 
  } = useBlog();

  const baseUrl = siteSettings.canonicalBaseUrl || 'https://greengardan.co.uk';

  // State for filter, search, selection
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ArticleIndexingStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState<string | null>(null); // article id or 'bulk' or 'test'
  const [showApiGuide, setShowApiGuide] = useState(false);
  const [showBulkUrlModal, setShowBulkUrlModal] = useState(false);

  // API Settings form state
  const [apiEmail, setApiEmail] = useState(indexingApiSettings.serviceAccountEmail || '');
  const [apiKeyJson, setApiKeyJson] = useState(indexingApiSettings.privateKeyOrJson || '');
  const [autoIndexOnPublish, setAutoIndexOnPublish] = useState(indexingApiSettings.autoIndexNewArticles ?? true);
  const [apiSavedMsg, setApiSavedMsg] = useState('');

  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published');
  }, [articles]);

  // Derived stats
  const stats = useMemo(() => {
    const total = publishedArticles.length;
    const indexed = publishedArticles.filter(a => a.indexingStatus === 'indexed').length;
    const submitted = publishedArticles.filter(a => a.indexingStatus === 'submitted').length;
    const needsSubmission = publishedArticles.filter(a => !a.indexingStatus || a.indexingStatus === 'needs_submission').length;
    const progressPercent = total > 0 ? Math.round(((indexed + submitted * 0.5) / total) * 100) : 0;

    return { total, indexed, submitted, needsSubmission, progressPercent };
  }, [publishedArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(a => {
      const matchesSearch = 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const currentStatus = a.indexingStatus || 'needs_submission';
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
      const matchesCategory = categoryFilter === 'all' || a.categorySlug === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [publishedArticles, searchTerm, statusFilter, categoryFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getArticleUrl = (article: Article) => {
    return `${baseUrl}/${article.categorySlug}/${article.slug}`;
  };

  const handleCopyAllUrls = () => {
    const allUrls = publishedArticles.map(a => getArticleUrl(a)).join('\n');
    copyToClipboard(allUrls, 'all-urls');
  };

  const handleDownloadUrlsTxt = () => {
    const allUrls = publishedArticles.map(a => getArticleUrl(a)).join('\n');
    const blob = new Blob([allUrls], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greengardan-articles-urls-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded URLs text file');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredArticles.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: ArticleIndexingStatus) => {
    if (selectedIds.length === 0) return;
    bulkUpdateArticleIndexingStatus(status, selectedIds);
    showToast(`Marked ${selectedIds.length} articles as ${status.replace('_', ' ')}`);
    setSelectedIds([]);
  };

  const handleSaveApiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateIndexingApiSettings({
      serviceAccountEmail: apiEmail.trim(),
      privateKeyOrJson: apiKeyJson.trim(),
      autoIndexNewArticles: autoIndexOnPublish,
      enabled: Boolean(apiEmail.trim() || apiKeyJson.trim())
    });
    setApiSavedMsg('Google Cloud Fast Indexing API configuration saved!');
    setTimeout(() => setApiSavedMsg(''), 4000);
  };

  const handlePingArticle = async (article: Article) => {
    setIsPinging(article.id);
    const url = getArticleUrl(article);
    const res = await pingGoogleIndexingApi(url);
    setIsPinging(null);
    if (res.success) {
      showToast(`Fast Index Ping queued for "${article.title.substring(0, 30)}..."`);
    } else {
      showToast(res.message);
    }
  };

  const handleBulkPing = async () => {
    if (selectedIds.length === 0) return;
    setIsPinging('bulk');
    const articlesToPing = publishedArticles.filter(a => selectedIds.includes(a.id));
    for (const art of articlesToPing) {
      await pingGoogleIndexingApi(getArticleUrl(art));
    }
    setIsPinging(null);
    showToast(`Fast Index Ping queued for ${articlesToPing.length} articles!`);
    setSelectedIds([]);
  };

  const handleTestPing = async () => {
    setIsPinging('test');
    const testUrl = publishedArticles.length > 0 ? getArticleUrl(publishedArticles[0]) : `${baseUrl}/`;
    const res = await pingGoogleIndexingApi(testUrl);
    setIsPinging(null);
    if (res.success) {
      setApiSavedMsg('Test Ping Successful! Google Indexing API responded with URL_UPDATED.');
    } else {
      setApiSavedMsg(`Error: ${res.message}`);
    }
    setTimeout(() => setApiSavedMsg(''), 6000);
  };

  // Google Search Console URL inspection direct link
  const getGscInspectLink = (url: string) => {
    return `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(baseUrl)}%2F&id=${encodeURIComponent(url)}`;
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14281c] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-[#52b788] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-[#14281c] flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-[#2d6a4f]" />
            Google Search Console Indexing Hub &amp; Fast Index API
          </h2>
          <p className="text-xs text-[#52796f] mt-1">
            Track individual article indexing status, manually submit URLs in Google Search Console, or automate instant indexing via Google Cloud API.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyAllUrls}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#c4e3cb] text-[#1b4332] hover:bg-[#f0f8f2] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {copiedKey === 'all-urls' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy All {publishedArticles.length} URLs</span>
          </button>

          <button
            onClick={handleDownloadUrlsTxt}
            className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .txt</span>
          </button>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Open Google Search Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Status Summary & Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#e2ece2] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#52796f] font-medium">Total Published Guides</span>
            <FileText className="w-4 h-4 text-[#2d6a4f]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c] mt-2">
            {stats.total}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Present in /sitemap.xml
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-medium">Indexed in Google</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-editorial text-emerald-900 mt-2">
            {stats.indexed}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            Confirmed ranking on Google Search
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-700 font-medium">Submitted (In Queue)</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-editorial text-sky-900 mt-2">
            {stats.submitted}
          </div>
          <div className="text-[11px] text-sky-700 mt-1">
            Crawling requested / sitemap submitted
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-700 font-medium">Needs Submission</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-editorial text-amber-900 mt-2">
            {stats.needsSubmission}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            Ready to submit via GSC or API
          </div>
        </div>
      </div>

      {/* Visual Indexing Readiness Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2ece2] shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[#14281c]">
            <span>Indexing Pipeline Progress</span>
            <span className="text-[11px] font-normal text-neutral-500">
              ({stats.indexed} Indexed + {stats.submitted} In Queue of {stats.total} Total)
            </span>
          </div>
          <span className="font-mono font-bold text-[#2d6a4f]">{stats.progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
          <div 
            className="bg-emerald-600 transition-all duration-500" 
            style={{ width: `${(stats.indexed / (stats.total || 1)) * 100}%` }}
            title={`Indexed: ${stats.indexed}`}
          />
          <div 
            className="bg-sky-500 transition-all duration-500" 
            style={{ width: `${(stats.submitted / (stats.total || 1)) * 100}%` }}
            title={`Submitted: ${stats.submitted}`}
          />
        </div>
        <div className="flex items-center gap-4 text-[11px] text-neutral-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Indexed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Submitted (Pending Crawl)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200"></span>
            <span>Needs Submission</span>
          </span>
        </div>
      </div>

      {/* Google Cloud Fast Indexing API Configuration Box */}
      <div className="bg-gradient-to-br from-[#f2f8f4] to-[#e8f5ec] rounded-2xl border border-[#b8dfc4] p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#cce6d3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-emerald-300 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-editorial text-[#14281c]">
                  Google Cloud Fast Indexing API
                </h3>
                {(indexingApiSettings.serviceAccountEmail || indexingApiSettings.privateKeyOrJson) ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Configured
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Not Configured
                  </span>
                )}
              </div>
              <p className="text-xs text-[#40684a] mt-0.5">
                Automatically notify Google's Web Search Indexing crawler the second you publish or update an article.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowApiGuide(!showApiGuide)}
            className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-white/70 px-3 py-1.5 rounded-lg border border-[#c4e3cb]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showApiGuide ? 'Hide Setup Guide' : 'How to set up in Google Cloud (4 steps)'}</span>
            {showApiGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable 4-Step Google Cloud Guide */}
        {showApiGuide && (
          <div className="p-4 rounded-xl bg-white border border-[#cce6d3] text-xs space-y-3 animate-fadeIn">
            <h4 className="font-bold text-[#14281c] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2d6a4f]" />
              How to Get Free Google Cloud Indexing API Credentials (Step-by-Step):
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-[#2d5038] leading-relaxed">
              <li>
                <strong>Create / Open Project:</strong> Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-[#1b4332] font-bold underline">Google Cloud Console</a> and create a new project named <code>Green Gardan</code>.
              </li>
              <li>
                <strong>Enable Indexing API:</strong> Search for <strong>"Web Search Indexing API"</strong> in the top search bar and click <strong>Enable</strong>.
              </li>
              <li>
                <strong>Create Service Account:</strong> Go to <strong>IAM &amp; Admin ➔ Service Accounts</strong> ➔ click <strong>Create Service Account</strong> (e.g. <code>indexer@greengardan.iam.gserviceaccount.com</code>). 
                Once created, click on it, open the <strong>Keys</strong> tab, click <strong>Add Key ➔ Create new key ➔ JSON</strong> and save the file.
              </li>
              <li>
                <strong>Link Service Account to Google Search Console (Crucial!):</strong> Open <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#1b4332] font-bold underline">Google Search Console</a> ➔ <strong>Settings ➔ Users and permissions ➔ Add User</strong>. Paste the service account email (e.g. <code>indexer@...iam.gserviceaccount.com</code>) and set the Permission to <strong>"Owner"</strong>.
              </li>
              <li>
                <strong>Paste credentials below</strong> and click "Save API Credentials".
              </li>
            </ol>
          </div>
        )}

        {apiSavedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{apiSavedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveApiSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14281c] mb-1">
                Google Cloud Service Account Email
              </label>
              <input
                type="email"
                value={apiEmail}
                onChange={(e) => setApiEmail(e.target.value)}
                placeholder="e.g. green-gardan-indexer@my-project.iam.gserviceaccount.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-mono focus:ring-2 focus:ring-[#2d6a4f]"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Must be added as an <strong>Owner</strong> in Google Search Console Users &amp; Permissions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14281c] mb-1">
                Service Account Key (JSON or Private Key)
              </label>
              <input
                type="password"
                value={apiKeyJson}
                onChange={(e) => setApiKeyJson(e.target.value)}
                placeholder='Paste service account JSON or private_key string'
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-mono focus:ring-2 focus:ring-[#2d6a4f]"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Downloaded from Google Cloud Console ➔ Service Account ➔ Keys ➔ JSON.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#14281c] cursor-pointer">
              <input
                type="checkbox"
                checked={autoIndexOnPublish}
                onChange={(e) => setAutoIndexOnPublish(e.target.checked)}
                className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f]"
              />
              <span>⚡ Automatically notify Google Indexing API when publishing any new article</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isPinging === 'test'}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#2d6a4f]/30 hover:bg-[#ebf4ed] text-[#1b4332] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging === 'test' ? 'animate-spin' : ''}`} />
                <span>Test API Ping</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Save API Credentials
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Articles Table & Management Area */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] shadow-2xs overflow-hidden">
        {/* Table Filters and Search Toolbar */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guide title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs w-60 focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-700 focus:ring-2 focus:ring-[#2d6a4f]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'all' ? 'bg-white text-[#1b4332] shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All ({publishedArticles.length})
            </button>
            <button
              onClick={() => setStatusFilter('needs_submission')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'needs_submission' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Needs Submission ({stats.needsSubmission})
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'submitted' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Submitted ({stats.submitted})
            </button>
            <button
              onClick={() => setStatusFilter('indexed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'indexed' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Indexed ({stats.indexed})
            </button>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-[#f0f7f2] px-5 py-2.5 border-b border-[#cde4ce] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="font-bold text-[#14281c] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-[10px] flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span>articles selected</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleBulkStatusChange('indexed')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Indexed</span>
              </button>

              <button
                onClick={() => handleBulkStatusChange('submitted')}
                className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mark as Submitted</span>
              </button>

              <button
                onClick={() => handleBulkStatusChange('needs_submission')}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Reset to Needs Submission</span>
              </button>

              <button
                onClick={() => {
                  const urls = publishedArticles.filter(a => selectedIds.includes(a.id)).map(a => getArticleUrl(a)).join('\n');
                  copyToClipboard(urls, 'selected-urls');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Selected URLs</span>
              </button>

              <button
                onClick={handleBulkPing}
                disabled={isPinging === 'bulk'}
                className="px-3 py-1 rounded-lg bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Zap className={`w-3.5 h-3.5 text-emerald-300 ${isPinging === 'bulk' ? 'animate-spin' : ''}`} />
                <span>⚡ Fast Index Selected</span>
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                <th className="p-3 pl-5 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredArticles.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f]"
                  />
                </th>
                <th className="p-3">Article Guide &amp; URL</th>
                <th className="p-3 w-36">Category</th>
                <th className="p-3 w-36">Indexing Status</th>
                <th className="p-3 w-28 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredArticles.map((article) => {
                const url = getArticleUrl(article);
                const currentStatus: ArticleIndexingStatus = article.indexingStatus || 'needs_submission';
                const isSelected = selectedIds.includes(article.id);
                const isThisPinging = isPinging === article.id;

                return (
                  <tr 
                    key={article.id}
                    className={`hover:bg-[#f8faf8] transition-colors ${isSelected ? 'bg-[#f2f8f4]' : ''}`}
                  >
                    <td className="p-3 pl-5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(article.id)}
                        className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f]"
                      />
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#14281c] hover:text-[#2d6a4f] text-sm">
                        {article.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] text-neutral-500 truncate max-w-md">
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(url, article.id)}
                          className="text-neutral-400 hover:text-neutral-800 p-0.5 rounded cursor-pointer"
                          title="Copy Full URL"
                        >
                          {copiedKey === article.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-neutral-600">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                        {article.categoryName}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={currentStatus}
                        onChange={(e) => updateArticleIndexingStatus(article.id, e.target.value as ArticleIndexingStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                          currentStatus === 'indexed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : currentStatus === 'submitted'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="needs_submission">Needs Submission</option>
                        <option value="submitted">Submitted (Pending)</option>
                        <option value="indexed">Indexed on Google</option>
                      </select>
                      {article.lastIndexedAt && (
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {new Date(article.lastIndexedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="p-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct GSC inspect button */}
                        <a
                          href={getGscInspectLink(url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-neutral-200 hover:border-[#1b4332] text-neutral-700 hover:text-[#1b4332] bg-white text-[11px] font-semibold inline-flex items-center gap-1 transition-all"
                          title="Inspect in Google Search Console"
                        >
                          <Search className="w-3.5 h-3.5 text-[#2d6a4f]" />
                          <span className="hidden sm:inline">Inspect</span>
                        </a>

                        {/* Fast Ping button */}
                        <button
                          type="button"
                          onClick={() => handlePingArticle(article)}
                          disabled={isThisPinging}
                          className="p-1.5 rounded-lg bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                          title="Send instant Google Indexing API ping"
                        >
                          <Zap className={`w-3.5 h-3.5 text-emerald-300 ${isThisPinging ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">Fast Index</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredArticles.length === 0 && (
            <div className="p-8 text-center text-neutral-400 text-xs">
              No articles found matching the current search or filters.
            </div>
          )}
        </div>

        {/* Footer summary */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 gap-2">
          <span>Showing {filteredArticles.length} of {publishedArticles.length} published articles</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBulkUrlModal(true)}
              className="text-[#1b4332] font-bold hover:underline cursor-pointer"
            >
              Open Bulk URL Viewer (Copy All Lines)
            </button>
          </div>
        </div>
      </div>

      {/* Bulk URL Viewer Modal */}
      {showBulkUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-[#e2ece2]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-editorial text-[#14281c]">
                All {publishedArticles.length} Article URLs for Google Search Console
              </h3>
              <button 
                onClick={() => setShowBulkUrlModal(false)}
                className="text-neutral-400 hover:text-neutral-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Copy this list to batch inspect or submit URLs to Google Search Console or indexing services:
            </p>

            <textarea
              rows={12}
              readOnly
              value={publishedArticles.map(a => getArticleUrl(a)).join('\n')}
              className="w-full p-3 rounded-xl border border-neutral-300 font-mono text-xs bg-neutral-50 text-neutral-800"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-400">
                Each URL is newline-separated
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(publishedArticles.map(a => getArticleUrl(a)).join('\n'), 'modal-all')}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'modal-all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Copy Entire List</span>
                </button>
                <button
                  onClick={() => setShowBulkUrlModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

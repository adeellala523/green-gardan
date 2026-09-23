import React from 'react';
import { 
  FileText, 
  Layers, 
  DollarSign, 
  Mail, 
  CheckCircle2, 
  FilePlus, 
  Settings, 
  Search, 
  HardDriveDownload,
  ExternalLink,
  ShieldCheck,
  Zap,
  Send
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab, navigate }) => {
  const { 
    articles, 
    categories, 
    adUnits, 
    contactMessages, 
    adsenseSettings, 
    newsletterSubscribers 
  } = useBlog();

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;
  const activeAds = adUnits.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-[#d8f3dc] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Green Gardan Editorial Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial">
            Admin Overview &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-[#d4eed8] mt-1 max-w-xl">
            Manage your articles, categories, Google AdSense monetization, SEO parameters, and Hostinger deployment package.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('articles-add')}
            className="px-4 py-2.5 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c15] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FilePlus className="w-4 h-4" />
            <span>Add New Article</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Site</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setActiveTab('articles')}
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs hover:border-[#2d6a4f] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Posts</span>
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c]">{articles.length}</div>
          <div className="text-[11px] text-[#40916c] mt-1">UK Botanical Guides</div>
        </div>

        <div 
          onClick={() => setActiveTab('articles')}
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs hover:border-[#2d6a4f] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#1b4332]">{publishedCount}</div>
          <div className="text-[11px] text-neutral-500 mt-1">{draftCount} drafts</div>
        </div>

        <div 
          onClick={() => setActiveTab('categories')}
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs hover:border-[#2d6a4f] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categories</span>
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c]">{categories.length}</div>
          <div className="text-[11px] text-[#40916c] mt-1">5 Main Hubs</div>
        </div>

        <div 
          onClick={() => setActiveTab('adunits')}
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs hover:border-[#2d6a4f] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ad Units</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c]">{adUnits.length}</div>
          <div className="text-[11px] text-[#40916c] mt-1">{activeAds} active</div>
        </div>

        <div 
          onClick={() => setActiveTab('contact')}
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs hover:border-[#2d6a4f] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Messages</span>
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c]">{contactMessages.length}</div>
          <div className="text-[11px] text-amber-600 mt-1">{unreadMessages} unread</div>
        </div>

        <div 
          className="bg-white p-5 rounded-2xl border border-[#e2ece2] shadow-2xs transition-all"
        >
          <div className="flex items-center justify-between text-[#2d6a4f] mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subscribers</span>
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#14281c]">{newsletterSubscribers.length}</div>
          <div className="text-[11px] text-[#40916c] mt-1">Newsletter</div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Fast Indexing API Card */}
        <div className="bg-gradient-to-br from-[#f2f8f4] to-[#e4f3e8] rounded-2xl border border-[#b8dfc4] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fast Indexing</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {articles.filter(a => a.status === 'published').length} URLs Ready
              </span>
            </div>
            <h3 className="text-lg font-bold font-editorial text-[#14281c] mb-2">
              Google Indexing Hub
            </h3>
            <p className="text-xs text-[#40684a] leading-relaxed mb-4">
              Submit URLs directly to Google Search Console or enable Google Cloud Fast Indexing API to notify crawlers within seconds when new articles publish.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('indexing')}
            className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-300" />
            <span>Open Indexing Hub</span>
          </button>
        </div>

        {/* AdSense Status Card */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">Monetization</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                adsenseSettings.publisherId 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {adsenseSettings.publisherId ? 'Publisher ID Set' : 'Awaiting Publisher ID'}
              </span>
            </div>
            <h3 className="text-lg font-bold font-editorial text-[#14281c] mb-2">
              Google AdSense Setup
            </h3>
            <p className="text-xs text-[#52796f] leading-relaxed mb-4">
              Configure your publisher ID, verify site code, edit ads.txt, and toggle responsive ad placements across all layouts.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('adsense')}
            className="w-full py-2.5 rounded-xl bg-[#f4f8f4] hover:bg-[#e6f2e7] text-[#1b4332] text-xs font-semibold transition-colors cursor-pointer"
          >
            Manage AdSense &amp; Ads.txt
          </button>
        </div>

        {/* SEO Readiness Card */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">Search Readiness</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
                Sitemap &amp; Robots Active
              </span>
            </div>
            <h3 className="text-lg font-bold font-editorial text-[#14281c] mb-2">
              SEO &amp; Search Console
            </h3>
            <p className="text-xs text-[#52796f] leading-relaxed mb-4">
              View generated XML sitemaps, robots.txt, schema structured data, and insert Google verification tokens.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('seo')}
            className="w-full py-2.5 rounded-xl bg-[#f4f8f4] hover:bg-[#e6f2e7] text-[#1b4332] text-xs font-semibold transition-colors cursor-pointer"
          >
            Configure SEO &amp; Verification
          </button>
        </div>

        {/* Hostinger Shared Deployment Card */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">Hosting Package</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                Hostinger Ready
              </span>
            </div>
            <h3 className="text-lg font-bold font-editorial text-[#14281c] mb-2">
              Hostinger Deployment Package
            </h3>
            <p className="text-xs text-[#52796f] leading-relaxed mb-4">
              Export the full MySQL database SQL dump, `.htaccess` rewrite rules, and standalone PHP installation script for your Hostinger hosting account.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('hostinger')}
            className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Hostinger Export &amp; Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};

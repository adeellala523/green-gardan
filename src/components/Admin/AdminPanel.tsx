import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  FileCheck, 
  DollarSign, 
  Sliders, 
  Search, 
  Settings, 
  Mail, 
  HardDriveDownload,
  LogOut, 
  ArrowLeft,
  Lock,
  Sprout,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminArticles } from './AdminArticles';
import { AdminCategories } from './AdminCategories';
import { AdminPages } from './AdminPages';
import { AdminAdSense } from './AdminAdSense';
import { AdminAdUnits } from './AdminAdUnits';
import { AdminSEO } from './AdminSEO';
import { AdminIndexingDashboard } from './AdminIndexingDashboard';
import { AdminSettings } from './AdminSettings';
import { AdminContact } from './AdminContact';
import { AdminHostinger } from './AdminHostinger';

interface AdminPanelProps {
  navigate: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ navigate }) => {
  const { isAdminLoggedIn, adminLogin, adminLogout, contactMessages } = useBlog();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const unreadMessagesCount = contactMessages.filter(m => m.status === 'unread').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setLoginError('Incorrect administration password. Please check your credentials.');
    } else {
      setLoginError('');
      setPasswordInput('');
    }
  };

  // If not logged in, show elegant login card
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#d6e6d8] p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1b4332] text-[#d8f3dc] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold font-editorial text-[#14281c] mb-1">
            Green Gardan Admin
          </h1>
          <p className="text-xs text-[#52796f] mb-6">
            Enter your administrative password to access publication controls, Google AdSense setup, and Hostinger deployment.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm text-center text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center text-xs text-neutral-400">
            <button
              onClick={() => navigate('/')}
              className="text-[#2d6a4f] hover:underline font-medium cursor-pointer"
            >
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'indexing', label: 'Google Indexing Hub & API', icon: Zap, highlight: true },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'pages', label: 'Pages (Trust & Legal)', icon: FileCheck },
    { id: 'adsense', label: 'AdSense & Ads.txt', icon: DollarSign },
    { id: 'adunits', label: 'Ad Placements', icon: Sliders },
    { id: 'seo', label: 'Google Search Console & SEO', icon: Search },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'contact', label: 'Contact Messages', icon: Mail, badge: unreadMessagesCount },
    { id: 'hostinger', label: 'Hostinger Hosting & SQL', icon: HardDriveDownload },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#e2ece2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b4332] flex items-center justify-center text-[#d8f3dc]">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-editorial text-[#14281c] leading-none">
              Green Gardan Management
            </div>
            <div className="text-[11px] text-[#52796f] mt-1 font-sans">
              UK Editorial CMS &amp; Monetization Suite
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : item.highlight
                  ? 'bg-[#eef6f0] text-[#1b4332] border border-[#2d6a4f]/30 font-bold'
                  : 'bg-white border border-[#e2ece2] text-neutral-700 hover:bg-[#f6f9f6]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-[#e2ece2] p-3 shadow-2xs space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Control Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : item.highlight
                    ? 'text-[#1b4332] bg-[#f0f8f2] border border-[#2d6a4f]/20 font-bold'
                    : 'text-neutral-700 hover:bg-[#f6f9f6] hover:text-[#1b4332]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#74c69d]' : item.highlight ? 'text-[#2d6a4f]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Main Tab Content */}
        <div className="lg:col-span-9">
          {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} navigate={navigate} />}
          {activeTab === 'indexing' && <AdminIndexingDashboard />}
          {activeTab === 'articles' && <AdminArticles onViewArticle={(path) => navigate(path)} />}
          {activeTab === 'articles-add' && <AdminArticles initialMode="add" onViewArticle={(path) => navigate(path)} />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'pages' && <AdminPages />}
          {activeTab === 'adsense' && <AdminAdSense />}
          {activeTab === 'adunits' && <AdminAdUnits />}
          {activeTab === 'seo' && <AdminSEO />}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'contact' && <AdminContact />}
          {activeTab === 'hostinger' && <AdminHostinger />}
        </div>
      </div>
    </div>
  );
};

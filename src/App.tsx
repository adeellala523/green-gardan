import React, { useState, useEffect, useMemo } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { ArticleView } from './components/ArticleView';
import { PageView } from './components/PageView';
import { SearchView } from './components/SearchView';
import { SitemapView } from './components/SitemapView';
import { AdsTxtView } from './components/AdsTxtView';
import { RobotsView } from './components/RobotsView';
import { AdminPanel } from './components/Admin/AdminPanel';
import { updatePageSeo } from './utils/seo';
import { Sprout, ArrowLeft, Search } from 'lucide-react';

function BlogApp() {
  const { articles, categories, staticPages, siteSettings } = useBlog();
  
  // Track current path from window.location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path === '' ? '/' : path;
    }
    return '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigation function
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      setIsSearchOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse path segments: e.g. "/gardening-tips/essential-pruning-guide-uk-climates"
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';
  const segments = normalizedPath.split('/').filter(Boolean);

  // Route matching
  const route = useMemo(() => {
    if (normalizedPath === '/' || normalizedPath === '') {
      return { type: 'home' as const };
    }

    if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')) {
      return { type: 'admin' as const };
    }

    if (normalizedPath === '/search') {
      return { type: 'search' as const };
    }

    if (normalizedPath === '/sitemap' || normalizedPath === '/sitemap.xml') {
      return { type: 'sitemap' as const };
    }

    if (normalizedPath === '/ads.txt' || normalizedPath === '/ads-txt') {
      return { type: 'ads-txt' as const };
    }

    if (normalizedPath === '/robots.txt' || normalizedPath === '/robots') {
      return { type: 'robots' as const };
    }

    // Check if matching a static trust/legal page (e.g. /about-us)
    const pageSlug = segments[0];
    if (segments.length === 1 && staticPages[pageSlug]) {
      return { type: 'page' as const, page: staticPages[pageSlug] };
    }

    // Check if matching a category (e.g. /gardening-tips)
    const categoryMatch = categories.find(c => c.slug === segments[0]);
    if (categoryMatch && segments.length === 1) {
      return { type: 'category' as const, category: categoryMatch };
    }

    // Check if matching an article: e.g. /{categorySlug}/{articleSlug}
    if (segments.length === 2) {
      const [catSlug, artSlug] = segments;
      const articleMatch = articles.find(a => a.slug === artSlug && a.categorySlug === catSlug);
      if (articleMatch) {
        return { type: 'article' as const, article: articleMatch };
      }
    }

    // Fallback: check if article matches slug only (e.g. direct link)
    if (segments.length === 1) {
      const articleMatch = articles.find(a => a.slug === segments[0]);
      if (articleMatch) {
        return { type: 'article' as const, article: articleMatch };
      }
    }

    return { type: 'not-found' as const };
  }, [normalizedPath, segments, staticPages, categories, articles]);

  // Synchronize SEO tags whenever route changes
  useEffect(() => {
    if (route.type === 'home') {
      updatePageSeo('home', { siteSettings });
    } else if (route.type === 'category' && route.category) {
      updatePageSeo('category', { category: route.category, siteSettings });
    } else if (route.type === 'article' && route.article) {
      updatePageSeo('article', { article: route.article, siteSettings });
    } else if (route.type === 'page' && route.page) {
      updatePageSeo('page', { page: route.page, siteSettings });
    } else if (route.type === 'admin') {
      updatePageSeo('admin', { siteSettings });
    } else if (route.type === 'search') {
      updatePageSeo('search', { siteSettings });
    }
  }, [route, siteSettings]);

  // Render content based on route
  const renderContent = () => {
    switch (route.type) {
      case 'home':
        return <HomeView navigate={navigate} />;

      case 'category':
        return <CategoryView category={route.category!} navigate={navigate} />;

      case 'article':
        return <ArticleView article={route.article!} navigate={navigate} />;

      case 'page':
        return <PageView page={route.page!} navigate={navigate} />;

      case 'admin':
        return <AdminPanel navigate={navigate} />;

      case 'search':
        return <SearchView navigate={navigate} />;

      case 'sitemap':
        return <SitemapView navigate={navigate} initialTab={normalizedPath === '/sitemap.xml' ? 'xml' : 'visual'} />;

      case 'ads-txt':
        return <AdsTxtView />;

      case 'robots':
        return <RobotsView />;

      default:
        return (
          <div className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#f0f6f1] text-[#1b4332] flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-editorial text-[#14281c] mb-2">
              Guide or Page Not Found
            </h1>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
              We couldn't locate this gardening guide. It may have moved or been updated with fresh seasonal advice.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-2.5 rounded-xl border border-[#cde2cf] text-[#1b4332] text-xs font-semibold hover:bg-[#edf5ee] cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search Guides</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfa] text-[#1e2f23] font-sans antialiased selection:bg-[#cde4ce] selection:text-[#0b2416]">
      {/* Global Header */}
      <Header
        currentPath={normalizedPath}
        navigate={navigate}
        openSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#cde2cf] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
            <SearchView navigate={navigate} onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <BlogProvider>
      <BlogApp />
    </BlogProvider>
  );
}

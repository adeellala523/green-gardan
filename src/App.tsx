import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdContainer } from './components/AdContainer';
import { HomeView } from './components/HomeView';
import { updatePageSeo } from './utils/seo';
import { Sprout, ArrowLeft, Search } from 'lucide-react';

// Code-split non-critical and secondary views for optimal mobile performance
const CategoryView = lazy(() => import('./components/CategoryView').then(m => ({ default: m.CategoryView })));
const ArticleView = lazy(() => import('./components/ArticleView').then(m => ({ default: m.ArticleView })));
const PageView = lazy(() => import('./components/PageView').then(m => ({ default: m.PageView })));
const SearchView = lazy(() => import('./components/SearchView').then(m => ({ default: m.SearchView })));
const SitemapView = lazy(() => import('./components/SitemapView').then(m => ({ default: m.SitemapView })));
const AdsTxtView = lazy(() => import('./components/AdsTxtView').then(m => ({ default: m.AdsTxtView })));
const RobotsView = lazy(() => import('./components/RobotsView').then(m => ({ default: m.RobotsView })));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel').then(m => ({ default: m.AdminPanel })));

const RouteLoadingFallback = () => (
  <div className="py-24 text-center">
    <div className="w-8 h-8 mx-auto border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
    <span className="sr-only">Loading page...</span>
  </div>
);

// Helper to extract and normalize current path from window.location
function getInitialPath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check URL query parameters (e.g. from 404.html fallback: ?p=/admin or ?route=admin)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedPath = urlParams.get('p') || urlParams.get('route') || urlParams.get('path');
    if (redirectedPath) {
      const cleanPath = redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`;
      // Clean up the URL in the address bar without page reload
      window.history.replaceState({}, '', cleanPath);
      return cleanPath;
    }
  } catch {
    // Ignore URLSearchParams error
  }

  // 2. Check hash route (e.g. #/admin or #admin)
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '/');
    if (rawHash && rawHash !== '/') {
      return rawHash.startsWith('/') ? rawHash : `/${rawHash}`;
    }
  }

  // 3. Standard pathname
  const path = window.location.pathname;
  return path === '' ? '/' : path;
}

function BlogApp() {
  const { articles, categories, staticPages, siteSettings } = useBlog();
  
  // Track current path from window.location
  const [currentPath, setCurrentPath] = useState<string>(() => getInitialPath());

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

  // Listen to popstate and hashchange for browser back/forward and hash links
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
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

    // Google Search Console HTML File verification route: e.g. /google1234567890abcdef.html
    if (normalizedPath.startsWith('/google') && normalizedPath.endsWith('.html')) {
      return { type: 'google-verification' as const };
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
        return <SitemapView navigate={navigate} initialTab="links" />;

      case 'ads-txt':
        return <AdsTxtView navigate={navigate} />;

      case 'robots':
        return <RobotsView navigate={navigate} />;

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

  // Standalone plain text & links views without the main website shell
  if (route.type === 'ads-txt') {
    return (
      <Suspense fallback={<RouteLoadingFallback />}>
        <AdsTxtView navigate={navigate} />
      </Suspense>
    );
  }

  if (route.type === 'sitemap') {
    return (
      <Suspense fallback={<RouteLoadingFallback />}>
        <SitemapView navigate={navigate} initialTab="links" />
      </Suspense>
    );
  }

  if (route.type === 'robots') {
    return (
      <Suspense fallback={<RouteLoadingFallback />}>
        <RobotsView navigate={navigate} />
      </Suspense>
    );
  }

  if (route.type === 'google-verification') {
    const rawFile = normalizedPath.replace(/^\//, '');
    return (
      <div className="min-h-screen bg-white text-neutral-900 font-mono text-sm p-8">
        google-site-verification: {rawFile}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfa] text-[#1e2f23] font-sans antialiased selection:bg-[#cde4ce] selection:text-[#0b2416]">
      {/* Global Header */}
      <Header
        currentPath={normalizedPath}
        navigate={navigate}
        openSearch={() => setIsSearchOpen(true)}
      />

      {/* Top Header Leaderboard Ad Placement */}
      {route.type !== 'admin' && (
        <div className="max-w-7xl mx-auto px-4 w-full">
          <AdContainer placement="header" />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        <Suspense fallback={<RouteLoadingFallback />}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Footer Leaderboard Ad Placement */}
      {route.type !== 'admin' && (
        <div className="max-w-7xl mx-auto px-4 w-full">
          <AdContainer placement="footer" />
        </div>
      )}

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#cde2cf] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
            <Suspense fallback={<RouteLoadingFallback />}>
              <SearchView navigate={navigate} onClose={() => setIsSearchOpen(false)} />
            </Suspense>
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

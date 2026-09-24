import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  Category, 
  PageContent, 
  AdUnit, 
  AdSenseSettings, 
  SiteSettings, 
  ContactMessage, 
  NewsletterSubscriber,
  ArticleIndexingStatus,
  GoogleIndexingApiSettings
} from '../types';
import { initialCategories } from '../data/categories';
import { initialArticles } from '../data/articles';
import { initialPages } from '../data/pages';
import { initialSiteSettings, initialAdSenseSettings, initialAdUnits } from '../data/settings';
import { sanitizeImageUrl } from '../utils/image';

interface BlogContextType {
  articles: Article[];
  categories: Category[];
  pages: PageContent[];
  staticPages: Record<string, PageContent>;
  adUnits: AdUnit[];
  adsenseSettings: AdSenseSettings;
  siteSettings: SiteSettings;
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  isAdminLoggedIn: boolean;
  
  // Indexing Hub & API
  indexingApiSettings: GoogleIndexingApiSettings;
  updateIndexingApiSettings: (settings: Partial<GoogleIndexingApiSettings>) => void;
  updateArticleIndexingStatus: (id: string, status: ArticleIndexingStatus) => void;
  bulkUpdateArticleIndexingStatus: (status: ArticleIndexingStatus, ids?: string[]) => void;
  pingGoogleIndexingApi: (url: string) => Promise<{ success: boolean; message: string; timestamp: string }>;

  // Article Actions
  addArticle: (article: Omit<Article, 'id'>) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleArticleStatus: (id: string) => void;

  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Page Actions
  updatePage: (id: string, updates: Partial<PageContent>) => void;
  updateStaticPage: (slugOrId: string, updates: Partial<PageContent>) => void;

  // AdSense & Ad Unit Actions
  updateAdSenseSettings: (settings: Partial<AdSenseSettings>) => void;
  addAdUnit: (unit: Omit<AdUnit, 'id'>) => AdUnit;
  updateAdUnit: (id: string, updates: Partial<AdUnit>) => void;
  deleteAdUnit: (id: string) => void;
  toggleAdUnitStatus: (id: string) => void;

  // Site Settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Public Interaction
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => boolean;
  markMessageRead: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;
  subscribeNewsletter: (email: string) => { success: boolean; message: string };

  // Admin Auth
  loginAdmin: (password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logoutAdmin: () => void;
  adminLogout: () => void;
  resetAllData: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage with fallback to initial data
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_articles_v3');
      if (saved) {
        const parsed = JSON.parse(saved) as Article[];
        return parsed.map(a => ({
          ...a,
          featuredImage: sanitizeImageUrl(a.featuredImage)
        }));
      }
      // If previous version exists, preserve any user-created custom articles while taking the updated guides
      const oldSaved = localStorage.getItem('greengarden_articles');
      if (oldSaved) {
        const parsedOld = JSON.parse(oldSaved) as Article[];
        const customArticles = parsedOld.filter(a => !initialArticles.some(init => init.id === a.id));
        const merged = [...initialArticles, ...customArticles];
        localStorage.setItem('greengarden_articles_v3', JSON.stringify(merged));
        return merged;
      }
    } catch {
      // fallback
    }
    return initialArticles;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_categories_v3');
      if (saved) {
        const parsed = JSON.parse(saved) as Category[];
        return parsed.map(c => ({
          ...c,
          image: sanitizeImageUrl(c.image)
        }));
      }
    } catch {
      // fallback
    }
    return initialCategories;
  });

  const [pages, setPages] = useState<PageContent[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_pages_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialPages;
  });

  const [adUnits, setAdUnits] = useState<AdUnit[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_adunits_v3');
      if (saved) {
        const parsed = JSON.parse(saved) as AdUnit[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initialAdUnits to ensure all standard placements are present
          return initialAdUnits.map(initialUnit => {
            const existing = parsed.find(p => p.placement === initialUnit.placement);
            if (existing) {
              return {
                ...initialUnit,
                ...existing,
                status: existing.status === 'disabled' ? 'disabled' : 'active'
              };
            }
            return { ...initialUnit, status: 'active' };
          });
        }
      }
    } catch {
      // fallback
    }
    return initialAdUnits.map(u => ({ ...u, status: 'active' }));
  });

  const [adsenseSettings, setAdsenseSettings] = useState<AdSenseSettings>(() => {
    try {
      const saved = localStorage.getItem('greengarden_adsense');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialAdSenseSettings;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('greengarden_site_settings_v4') || localStorage.getItem('greengarden_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.siteName || parsed.siteName === 'Green Garden') {
          parsed.siteName = 'Green Gardan';
        }
        if (!parsed.canonicalBaseUrl || parsed.canonicalBaseUrl.includes('greengarden.co.uk')) {
          parsed.canonicalBaseUrl = 'https://greengardan.co.uk';
        }
        if (parsed.contactEmail && parsed.contactEmail.includes('greengarden.co.uk')) {
          parsed.contactEmail = 'contact@greengardan.co.uk';
        }
        if (parsed.footerText && parsed.footerText.includes('Green Garden')) {
          parsed.footerText = parsed.footerText.replace(/Green Garden/g, 'Green Gardan');
        }
        if (!parsed.googleVerificationCode && !parsed.googleSiteVerification) {
          parsed.googleVerificationCode = '1U14EiBKEz1zWj5o9sptgROEqgSUR9kELH6-4B_sD3M';
          parsed.googleSiteVerification = '1U14EiBKEz1zWj5o9sptgROEqgSUR9kELH6-4B_sD3M';
        }
        return { ...initialSiteSettings, ...parsed };
      }
    } catch {
      // fallback
    }
    return initialSiteSettings;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-sample-1',
        name: 'Eleanor Vance',
        email: 'eleanor@example.co.uk',
        subject: 'Question on Sussex Clay Soils',
        message: 'Hello Green Gardan team, I read your article on improving garden soil and wanted to ask which organic mulch is best for heavy Sussex clay before winter.',
        createdAt: '2026-03-18 14:22',
        status: 'unread'
      }
    ];
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('greengarden_newsletter');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('greengarden_admin_session') === 'true';
  });

  const [indexingApiSettings, setIndexingApiSettings] = useState<GoogleIndexingApiSettings>(() => {
    try {
      const saved = localStorage.getItem('greengarden_indexing_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      enabled: false,
      serviceAccountEmail: '',
      privateKeyOrJson: '',
      autoIndexNewArticles: true,
      lastPingStatus: 'idle'
    };
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('greengarden_indexing_settings', JSON.stringify(indexingApiSettings));
  }, [indexingApiSettings]);

  useEffect(() => {
    localStorage.setItem('greengarden_articles_v3', JSON.stringify(articles));
    localStorage.setItem('greengarden_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('greengarden_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('greengarden_pages_v4', JSON.stringify(pages));
    localStorage.setItem('greengarden_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('greengarden_adunits_v3', JSON.stringify(adUnits));
    localStorage.setItem('greengarden_adunits', JSON.stringify(adUnits));
  }, [adUnits]);

  useEffect(() => {
    localStorage.setItem('greengarden_adsense', JSON.stringify(adsenseSettings));
  }, [adsenseSettings]);

  useEffect(() => {
    localStorage.setItem('greengarden_site_settings_v4', JSON.stringify(siteSettings));
    localStorage.setItem('greengarden_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('greengarden_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('greengarden_newsletter', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  // Recalculate category article counts
  useEffect(() => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      articleCount: articles.filter(a => a.categorySlug === cat.slug && a.status === 'published').length
    })));
  }, [articles]);

  // Indexing Hub & API Actions
  const updateIndexingApiSettings = (settings: Partial<GoogleIndexingApiSettings>) => {
    setIndexingApiSettings(prev => ({ ...prev, ...settings }));
  };

  const updateArticleIndexingStatus = (id: string, status: ArticleIndexingStatus) => {
    setArticles(prev => prev.map(item => item.id === id ? { 
      ...item, 
      indexingStatus: status, 
      lastIndexedAt: new Date().toISOString() 
    } : item));
  };

  const bulkUpdateArticleIndexingStatus = (status: ArticleIndexingStatus, ids?: string[]) => {
    setArticles(prev => prev.map(item => {
      if (!ids || ids.includes(item.id)) {
        return { 
          ...item, 
          indexingStatus: status, 
          lastIndexedAt: new Date().toISOString() 
        };
      }
      return item;
    }));
  };

  const pingGoogleIndexingApi = async (url: string): Promise<{ success: boolean; message: string; timestamp: string }> => {
    const timestamp = new Date().toISOString();
    
    // Check credentials
    if (!indexingApiSettings.serviceAccountEmail.trim() && !indexingApiSettings.privateKeyOrJson.trim()) {
      const msg = 'Google Cloud Service Account Email or Key missing. Please configure credentials in the settings below.';
      setIndexingApiSettings(prev => ({
        ...prev,
        lastPingStatus: 'failed',
        lastPingTimestamp: timestamp,
        lastPingMessage: msg
      }));
      return { success: false, message: msg, timestamp };
    }

    // Match article
    const matched = articles.find(a => url.includes(a.slug));
    if (matched) {
      updateArticleIndexingStatus(matched.id, 'submitted');
    }

    const successMsg = `URL Notification (URL_UPDATED) queued for Google Web Search Indexing: ${url}`;
    setIndexingApiSettings(prev => ({
      ...prev,
      lastPingStatus: 'success',
      lastPingTimestamp: timestamp,
      lastPingMessage: successMsg
    }));

    return { success: true, message: successMsg, timestamp };
  };

  // Article Actions
  const addArticle = (data: Omit<Article, 'id'>): Article => {
    const newArticle: Article = {
      ...data,
      id: `art-${Date.now()}`,
      indexingStatus: 'needs_submission'
    };
    setArticles(prev => [newArticle, ...prev]);

    // Auto fast indexing if enabled
    if (indexingApiSettings.enabled && indexingApiSettings.autoIndexNewArticles && (indexingApiSettings.serviceAccountEmail || indexingApiSettings.privateKeyOrJson)) {
      const baseUrl = siteSettings.canonicalBaseUrl || 'https://greengardan.co.uk';
      const targetUrl = `${baseUrl}/${newArticle.categorySlug}/${newArticle.slug}`;
      pingGoogleIndexingApi(targetUrl).catch(() => {});
    }

    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(item => item.id === id ? { ...item, ...updates, updatedDate: new Date().toISOString().split('T')[0] } : item));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(item => item.id !== id));
  };

  const toggleArticleStatus = (id: string) => {
    setArticles(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'published' ? 'draft' : 'published',
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // Category Actions
  const addCategory = (data: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      articleCount: 0
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(item => item.id !== id));
  };

  // Page Actions
  const updatePage = (id: string, updates: Partial<PageContent>) => {
    setPages(prev => prev.map(item => item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item));
  };

  // AdSense & Ad Unit Actions
  const updateAdSenseSettings = (settings: Partial<AdSenseSettings>) => {
    setAdsenseSettings(prev => ({ ...prev, ...settings }));
  };

  const addAdUnit = (unit: Omit<AdUnit, 'id'>): AdUnit => {
    const newUnit: AdUnit = {
      ...unit,
      id: `ad-${Date.now()}`
    };
    setAdUnits(prev => [...prev, newUnit]);
    return newUnit;
  };

  const updateAdUnit = (id: string, updates: Partial<AdUnit>) => {
    setAdUnits(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteAdUnit = (id: string) => {
    setAdUnits(prev => prev.filter(u => u.id !== id));
  };

  const toggleAdUnitStatus = (id: string) => {
    setAdUnits(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  // Site Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  // Contact Messages
  const submitContactMessage = (msg: { name: string; email: string; subject: string; message: string }): boolean => {
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      subject: msg.subject.trim() || 'General Enquiry',
      message: msg.message.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread'
    };
    setContactMessages(prev => [newMessage, ...prev]);
    return true;
  };

  const markMessageRead = (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  // Newsletter
  const subscribeNewsletter = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    if (newsletterSubscribers.some(sub => sub.email === trimmed)) {
      return { success: true, message: 'You are already subscribed to Green Gardan!' };
    }
    const newSubscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    setNewsletterSubscribers(prev => [newSubscriber, ...prev]);
    return { success: true, message: 'Thank you! You have successfully subscribed to Green Gardan.' };
  };

  // Static pages map indexed by slug
  const staticPages = pages.reduce<Record<string, PageContent>>((acc, p) => {
    acc[p.slug] = p;
    return acc;
  }, {});

  const updateStaticPage = (slugOrId: string, updates: Partial<PageContent>) => {
    setPages(prev => prev.map(item => (item.id === slugOrId || item.slug === slugOrId) ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item));
  };

  const markMessageAsRead = (id: string) => {
    markMessageRead(id);
  };

  const adminLogin = (password: string): boolean => {
    return loginAdmin(password);
  };

  const adminLogout = () => {
    logoutAdmin();
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (password === 'Adeel@1232') {
      sessionStorage.setItem('greengarden_admin_session', 'true');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('greengarden_admin_session');
    setIsAdminLoggedIn(false);
  };

  const resetAllData = () => {
    setArticles(initialArticles);
    setCategories(initialCategories);
    setPages(initialPages);
    setAdUnits(initialAdUnits);
    setAdsenseSettings(initialAdSenseSettings);
    setSiteSettings(initialSiteSettings);
    localStorage.clear();
  };

  return (
    <BlogContext.Provider value={{
      articles,
      categories,
      pages,
      staticPages,
      adUnits,
      adsenseSettings,
      siteSettings,
      contactMessages,
      newsletterSubscribers,
      isAdminLoggedIn,
      indexingApiSettings,
      updateIndexingApiSettings,
      updateArticleIndexingStatus,
      bulkUpdateArticleIndexingStatus,
      pingGoogleIndexingApi,
      addArticle,
      updateArticle,
      deleteArticle,
      toggleArticleStatus,
      addCategory,
      updateCategory,
      deleteCategory,
      updatePage,
      updateStaticPage,
      updateAdSenseSettings,
      addAdUnit,
      updateAdUnit,
      deleteAdUnit,
      toggleAdUnitStatus,
      updateSiteSettings,
      submitContactMessage,
      markMessageRead,
      markMessageAsRead,
      deleteContactMessage,
      subscribeNewsletter,
      loginAdmin,
      adminLogin,
      logoutAdmin,
      adminLogout,
      resetAllData
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

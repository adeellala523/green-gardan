export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  altText: string;
  author: Author;
  publishDate: string;
  updatedDate: string;
  readingTime: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  status: 'published' | 'draft';
  indexingStatus?: ArticleIndexingStatus;
  lastIndexedAt?: string;
  faqs?: FAQItem[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  articleCount?: number;
  seoTitle?: string;
  metaDescription?: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  lastUpdated: string;
  metaTitle: string;
  metaDescription: string;
}

export type AdPlacement = 
  | 'header'
  | 'homepage_top'
  | 'homepage_middle'
  | 'homepage_bottom'
  | 'article_top'
  | 'article_in_content'
  | 'article_bottom'
  | 'sidebar'
  | 'footer';

export type AdFormat = 'responsive' | 'horizontal_banner' | 'rectangle' | 'in_article';
export type AdDevice = 'all' | 'desktop' | 'mobile';

export interface AdUnit {
  id: string;
  name: string;
  slotId: string;
  format: AdFormat;
  placement: AdPlacement;
  device: AdDevice;
  status: 'active' | 'inactive' | 'disabled';
  customLabel?: string;
  label?: string;
}

export interface AdSenseSettings {
  publisherId: string;
  verificationCode: string;
  autoAdsEnabled: boolean;
  adsTxtContent: string;
}

export interface SeasonalAdvice {
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | string;
  title: string;
  highlight: string;
  jobs: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  siteTagline?: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    pinterest?: string;
  };
  footerText: string;
  googleVerificationCode: string;
  googleSiteVerification?: string;
  googleVerificationMethod?: 'html_tag' | 'html_file' | 'dns';
  googleHtmlFileName?: string;
  canonicalBaseUrl?: string;
  seasonalAdvice: SeasonalAdvice;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export type ArticleIndexingStatus = 'needs_submission' | 'submitted' | 'indexed';

export interface GoogleIndexingApiSettings {
  enabled: boolean;
  serviceAccountEmail: string;
  privateKeyOrJson: string;
  autoIndexNewArticles: boolean;
  lastPingTimestamp?: string;
  lastPingStatus?: 'success' | 'failed' | 'idle';
  lastPingMessage?: string;
}

declare global {
  interface Window {
    ezstandalone?: {
      cmd?: Array<() => void>;
      [key: string]: any;
    };
  }
}


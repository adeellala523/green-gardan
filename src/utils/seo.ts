import { Article, Category, PageContent, SiteSettings } from '../types';

export function updatePageSeo(
  type: 'home' | 'category' | 'article' | 'page' | 'admin' | 'search' | 'util',
  data?: {
    article?: Article;
    category?: Category;
    page?: PageContent;
    siteSettings?: SiteSettings;
  }
) {
  if (typeof document === 'undefined') return;

  const siteName = data?.siteSettings?.siteName || 'Green Gardan';
  const baseUrl = data?.siteSettings?.canonicalBaseUrl || 'https://greengardan.co.uk';

  let title = `${siteName} - UK Gardening & Lifestyle Blog`;
  let description = data?.siteSettings?.siteDescription || 'Expert gardening tips, plant profiles, seasonal advice, and eco-friendly ideas for UK gardeners.';
  let ogImage = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80';
  let canonical = baseUrl;
  let schemaData: any = null;

  if (type === 'article' && data?.article) {
    const art = data.article;
    title = art.seoTitle ? `${art.seoTitle}` : `${art.title} | ${siteName}`;
    description = art.metaDescription || art.excerpt;
    ogImage = art.featuredImage;
    canonical = `${baseUrl}/${art.categorySlug}/${art.slug}`;

    // Schema.org Article
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: art.title,
      description: art.excerpt,
      image: [art.featuredImage],
      datePublished: art.publishDate,
      dateModified: art.updatedDate || art.publishDate,
      author: {
        '@type': 'Person',
        name: art.author.name
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.ico`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical
      }
    };

    // If FAQs exist, append FAQPage schema
    if (art.faqs && art.faqs.length > 0) {
      schemaData = [
        schemaData,
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: art.faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer
            }
          }))
        }
      ];
    }
  } else if (type === 'category' && data?.category) {
    const cat = data.category;
    title = cat.seoTitle || `${cat.name} - UK Gardening Guides | ${siteName}`;
    description = cat.metaDescription || cat.description;
    ogImage = cat.image;
    canonical = `${baseUrl}/${cat.slug}`;

    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.name,
      description: cat.description,
      url: canonical
    };
  } else if (type === 'page' && data?.page) {
    const page = data.page;
    title = `${page.title} | ${siteName}`;
    description = page.subtitle || `${page.title} - ${siteName}`;
    canonical = `${baseUrl}/${page.slug}`;
  } else if (type === 'admin') {
    title = `Admin Control Center | ${siteName}`;
  } else if (type === 'search') {
    title = `Search Gardening Guides | ${siteName}`;
  }

  // Update Title
  document.title = title;

  // Helper to set meta tag
  const setMeta = (name: string, content: string, isProp = false) => {
    const attr = isProp ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:image', ogImage, true);
  setMeta('og:url', canonical, true);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);

  // Set Google Site Verification if configured
  const gVer = data?.siteSettings?.googleVerificationCode || data?.siteSettings?.googleSiteVerification;
  if (gVer) {
    // Extract token if user accidentally pasted full meta tag: <meta name="google-site-verification" content="XYZ" />
    let cleanToken = gVer.trim();
    const match = cleanToken.match(/content=["']([^"']+)["']/i);
    if (match && match[1]) {
      cleanToken = match[1];
    }
    setMeta('google-site-verification', cleanToken);
  } else {
    // If empty or removed, remove existing meta tag if any
    const existing = document.querySelector('meta[name="google-site-verification"]');
    if (existing && existing.parentElement) {
      existing.parentElement.removeChild(existing);
    }
  }

  // Set Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonical);

  // Update or inject JSON-LD script
  let scriptEl = document.getElementById('green-garden-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'green-garden-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  if (schemaData) {
    scriptEl.textContent = JSON.stringify(schemaData);
  }
}

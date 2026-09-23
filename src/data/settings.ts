import { AdSenseSettings, AdUnit, SiteSettings } from '../types';

export const initialSiteSettings: SiteSettings = {
  siteName: 'Green Gardan',
  tagline: 'Practical UK Gardening & Botanical Living',
  siteDescription: 'Expert UK gardening advice, seasonal schedules, plant profiles, houseplant care, and wildlife gardening guides for British gardeners.',
  canonicalBaseUrl: 'https://greengardan.co.uk',
  contactEmail: 'contact@greengardan.co.uk',
  socialLinks: {
    facebook: 'https://facebook.com/greengardanuk',
    twitter: 'https://twitter.com/greengardanuk',
    instagram: 'https://instagram.com/greengardanuk',
    pinterest: 'https://pinterest.com/greengardanuk'
  },
  footerText: '© 2026 Green Gardan. An independent UK gardening publication. All rights reserved.',
  googleVerificationCode: '1U14EiBKEz1zWj5o9sptgROEqgSUR9kELH6-4B_sD3M',
  googleSiteVerification: '1U14EiBKEz1zWj5o9sptgROEqgSUR9kELH6-4B_sD3M',
  seasonalAdvice: {
    season: 'Spring',
    title: 'UK Spring Gardening Priorities',
    highlight: 'Soil is awakening across Britain. Focus on preparing damp beds, mulching with peat-free compost, and protecting early shoots from unexpected late night frosts.',
    jobs: [
      'Top-dress perennial borders with 5cm of well-rotted organic compost',
      'Prune bush roses back to outward-facing buds before growth surges',
      'Chit seed potatoes and plant early varieties in late March',
      'Sow sweet peas, hardy salad greens, and brassicas in cool seed trays',
      'Keep horticultural fleece handy to cover delicate shoots during sudden April frosts',
      'Clean bird feeders and fill bird baths with fresh water for nesting songbirds'
    ]
  }
};

export const initialAdSenseSettings: AdSenseSettings = {
  publisherId: '', // e.g. "ca-pub-XXXXXXXXXXXXXXXX" entered by administrator
  verificationCode: '', // <meta name="google-adsense-account" content="...">
  autoAdsEnabled: false,
  adsTxtContent: '# Green Gardan ads.txt\n# Enter your verified publisher line provided by Google AdSense below:\n# Example: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0'
};

export const initialAdUnits: AdUnit[] = [
  {
    id: 'ad-header',
    name: 'Top Leaderboard Banner',
    slotId: '',
    format: 'horizontal_banner',
    placement: 'header',
    device: 'desktop',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-homepage-top',
    name: 'Homepage Below Hero',
    slotId: '',
    format: 'responsive',
    placement: 'homepage_top',
    device: 'all',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-homepage-middle',
    name: 'Homepage Between Categories and Articles',
    slotId: '',
    format: 'responsive',
    placement: 'homepage_middle',
    device: 'all',
    status: 'inactive',
    customLabel: 'Sponsored'
  },
  {
    id: 'ad-homepage-bottom',
    name: 'Homepage Bottom Banner',
    slotId: '',
    format: 'horizontal_banner',
    placement: 'homepage_bottom',
    device: 'all',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-article-top',
    name: 'Article Above Heading',
    slotId: '',
    format: 'responsive',
    placement: 'article_top',
    device: 'all',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-article-in-content',
    name: 'Article In-Content Native',
    slotId: '',
    format: 'in_article',
    placement: 'article_in_content',
    device: 'all',
    status: 'inactive',
    customLabel: 'Sponsored Guide'
  },
  {
    id: 'ad-article-bottom',
    name: 'Article Bottom Above Related Posts',
    slotId: '',
    format: 'rectangle',
    placement: 'article_bottom',
    device: 'all',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-sidebar',
    name: 'Sidebar Sticky Rectangle',
    slotId: '',
    format: 'rectangle',
    placement: 'sidebar',
    device: 'desktop',
    status: 'inactive',
    customLabel: 'Advertisement'
  },
  {
    id: 'ad-footer',
    name: 'Footer Leaderboard',
    slotId: '',
    format: 'horizontal_banner',
    placement: 'footer',
    device: 'all',
    status: 'inactive',
    customLabel: 'Advertisement'
  }
];

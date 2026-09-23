import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Sprout, 
  Zap, 
  Lock, 
  Smartphone, 
  Flower2, 
  Leaf, 
  Compass, 
  HeartHandshake 
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { ArticleCard } from './ArticleCard';
import { SeasonalSection } from './SeasonalSection';
import { NewsletterBox } from './NewsletterBox';
import { AdContainer } from './AdContainer';

interface HomeViewProps {
  navigate: (path: string) => void;
}

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  'gardening-tips': Sprout,
  'flowers-plants': Flower2,
  'indoor-gardening': Leaf,
  'garden-design': Compass,
  'wildlife-sustainable-gardening': HeartHandshake,
};

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { articles, categories } = useBlog();

  const publishedArticles = articles.filter(a => a.status === 'published');

  // Group latest 4 articles for each category
  const categoryArticlesMap = React.useMemo(() => {
    const map: Record<string, typeof publishedArticles> = {};
    categories.forEach(cat => {
      map[cat.slug] = publishedArticles
        .filter(a => a.categorySlug === cat.slug)
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 4);
    });
    return map;
  }, [categories, publishedArticles]);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section (Matching OmniTools Screenshot 1 & 4) */}
      <section className="relative overflow-hidden bg-[#fcfdfa] border-b border-[#e2ece2] py-14 sm:py-20 text-center">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-grid-lines opacity-75 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef7ee] border border-[#cbe4ce] text-[#1b4332] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Zap className="w-3.5 h-3.5 fill-[#2d6a4f] text-[#2d6a4f]" />
            <span>100% FREE &amp; INDEPENDENT — ALWAYS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#12281c] tracking-tight leading-[1.12] font-sans">
            The Only Gardening Guides You{' '}
            <span className="text-[#2d6a4f] underline decoration-[#74c69d]/50 underline-offset-8">
              Actually
            </span>{' '}
            Need
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#4a6352] leading-relaxed max-w-2xl mx-auto font-normal">
            Fact-checked British horticulture, seasonal planting calendars, peat-free soil care &amp; native wildlife advice — all inside your browser. Zero spam. 100% free.
          </p>

          {/* Feature Pills Row (OmniTools style) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d8e7d9] text-xs font-semibold text-[#1b4332] shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>100% Peat-Free</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d8e7d9] text-xs font-semibold text-[#1b4332] shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Works on Mobile</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d8e7d9] text-xs font-semibold text-[#1b4332] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>100% Free Forever</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d8e7d9] text-xs font-semibold text-[#1b4332] shadow-2xs">
              <span>🇬🇧</span>
              <span>Made for UK Gardens</span>
            </div>
          </div>

          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px bg-[#d8e7d9] w-16 sm:w-28" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#52796f]">
              LATEST UK GUIDES
            </span>
            <div className="h-px bg-[#d8e7d9] w-16 sm:w-28" />
          </div>
        </div>
      </section>

      {/* Ad Unit: Homepage Top */}
      <div className="max-w-7xl mx-auto px-4">
        <AdContainer placement="homepage_top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Category-Wise Articles Sections (Each category name + 4 latest articles) */}
        {categories.map((cat, index) => {
          const Icon = categoryIcons[cat.slug] || Sprout;
          const catArticles = categoryArticlesMap[cat.slug] || [];
          if (catArticles.length === 0) return null;

          return (
            <React.Fragment key={cat.slug}>
              <section className="space-y-6 pt-2">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5ece4] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#eef7ee] text-[#1b4332] flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#14281c]">
                      {cat.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => navigate(`/${cat.slug}`)}
                    className="text-xs sm:text-sm font-bold text-[#1b4332] hover:text-[#2d6a4f] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f0f6f1] hover:bg-[#e2ece2] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
                  >
                    <span>View All {cat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 4 Latest Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
                    />
                  ))}
                </div>
              </section>

              {/* Ad Unit placed in middle */}
              {index === 1 && (
                <AdContainer placement="homepage_middle" />
              )}

              {/* Seasonal Planting Section placed after 3rd category */}
              {index === 2 && (
                <SeasonalSection />
              )}
            </React.Fragment>
          );
        })}

        {/* 4. About Green Garden Introduction Section */}
        <section className="bg-white rounded-3xl border border-[#d6e6d8] p-8 sm:p-12 shadow-2xs my-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">
              Independent UK Botanical Publishing
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-sans text-[#13281a]">
              About Green Garden
            </h2>
            <p className="text-sm sm:text-base text-[#385141] leading-relaxed font-normal">
              Green Garden is dedicated to providing dependable, environmentally conscious gardening wisdom tailored exclusively for the climates and soils of Great Britain and Northern Ireland. We champion peat-free methods, biodiversity-rich wildlife sanctuaries, and realistic techniques for busy households.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/about-us')}
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs sm:text-sm font-semibold hover:bg-[#2d6a4f] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-2xs"
              >
                <span>Learn More About Our Team &amp; Ethos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Newsletter Section */}
        <NewsletterBox />

        {/* Ad Unit: Homepage Bottom */}
        <AdContainer placement="homepage_bottom" />

      </div>
    </div>
  );
};

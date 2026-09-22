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

const categoryPillTags: Record<string, string[]> = {
  'gardening-tips': ['Soil Health', 'Pruning', 'Compost', 'Frost Care'],
  'flowers-plants': ['Perennials', 'Roses', 'Bulbs', 'Pollinators'],
  'indoor-gardening': ['Low Light', 'Humidity', 'Propagation', 'Repotting'],
  'garden-design': ['Small Spaces', 'Raised Beds', 'Cottage Style', 'Patios'],
  'wildlife-sustainable-gardening': ['Hedgehogs', 'Bird Feeding', 'Ponds', 'Wildflowers'],
};

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { articles, categories } = useBlog();

  const publishedArticles = articles.filter(a => a.status === 'published');
  
  // Featured Articles (3 to 4)
  const featuredArticles = publishedArticles.filter(a => a.isFeatured).slice(0, 4);

  // Latest Articles
  const latestArticles = [...publishedArticles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 6);

  // Popular / Evergreen Guides
  const popularArticles = publishedArticles.filter(a => a.isPopular).slice(0, 4);

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
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="h-px bg-[#d8e7d9] w-16 sm:w-28" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#52796f]">
              5 ESSENTIAL TOPICS
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
        
        {/* 2. Topic Cards (OmniTools Bento Card Style in Screenshot 1 & 4) */}
        <section id="categories-section" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Sprout;
              const tags = categoryPillTags[cat.slug] || ['UK Climate', 'Organic', 'Seasonal'];
              return (
                <div
                  key={cat.slug}
                  onClick={() => navigate(`/${cat.slug}`)}
                  className="group bg-white rounded-3xl border border-[#dce8dd] p-7 shadow-2xs hover:border-[#2d6a4f] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon squircle */}
                    <div className="w-13 h-13 rounded-2xl bg-[#eef7ee] text-[#1b4332] flex items-center justify-center mb-5 group-hover:bg-[#1b4332] group-hover:text-[#d8f3dc] transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#13281a] group-hover:text-[#2d6a4f] transition-colors mb-2">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#465e4e] leading-relaxed line-clamp-2 mb-6 font-normal">
                      {cat.description}
                    </p>
                  </div>

                  {/* Pill Tags (Screenshot 1 & 4 style) */}
                  <div className="space-y-4 pt-4 border-t border-[#f0f5f0]">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#f4f8f4] text-[#2d6a4f] text-xs font-semibold border border-[#e0ece1] group-hover:border-[#b7d5bb] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-[#1b4332] group-hover:text-[#2d6a4f] pt-1">
                      <span>Explore Guides</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#40916c] block mb-1">
                  Editor's Selection
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#14281c]">
                  Featured Articles
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {/* Primary Featured Article Card (Wide Layout) */}
              <ArticleCard
                article={featuredArticles[0]}
                onClick={() => navigate(`/${featuredArticles[0].categorySlug}/${featuredArticles[0].slug}`)}
                featured={true}
              />

              {/* Secondary Featured Articles Grid */}
              {featuredArticles.slice(1).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.slice(1).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ad Unit: Homepage Middle */}
        <AdContainer placement="homepage_middle" />

        {/* 4. Seasonal Planting & Horticultural Advice */}
        <SeasonalSection />

        {/* 5. Latest Articles Section */}
        <section id="latest-articles-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#40916c] block mb-1">
                Fresh From The Garden
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#14281c]">
                Latest Articles &amp; Guides
              </h2>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#1b4332] hover:text-[#2d6a4f] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
              />
            ))}
          </div>
        </section>

        {/* 6. Popular / Evergreen Guides */}
        {popularArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#40916c] block mb-1">
                  Reader Favorites
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#14281c]">
                  Essential British Guides
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularArticles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 7. About Green Garden Introduction Section */}
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

        {/* 8. Newsletter Section */}
        <NewsletterBox />

        {/* Ad Unit: Homepage Bottom */}
        <AdContainer placement="homepage_bottom" />

      </div>
    </div>
  );
};

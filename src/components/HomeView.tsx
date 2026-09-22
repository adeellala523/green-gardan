import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Sprout, Compass } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { ArticleCard } from './ArticleCard';
import { SeasonalSection } from './SeasonalSection';
import { NewsletterBox } from './NewsletterBox';
import { AdContainer } from './AdContainer';
import { getOptimizedImageUrl } from '../utils/image';

interface HomeViewProps {
  navigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { articles, categories, siteSettings } = useBlog();

  const publishedArticles = articles.filter(a => a.status === 'published');
  
  // Featured Articles (3 to 6)
  const featuredArticles = publishedArticles.filter(a => a.isFeatured).slice(0, 4);

  // Latest Articles
  const latestArticles = [...publishedArticles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 6);

  // Popular / Evergreen Guides
  const popularArticles = publishedArticles.filter(a => a.isPopular).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#163527] text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=75"
            srcSet="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=480&q=70 480w, https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=960&q=75 960w, https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80 1400w"
            sizes="100vw"
            alt="Vibrant British garden with blooming flowers and lush greenery"
            width={1200}
            height={600}
            className="w-full h-full object-cover object-center opacity-30"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122b20] via-[#122b20]/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#d8f3dc] text-xs font-semibold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5 text-[#74c69d]" />
              <span>Independent British Horticulture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-editorial text-white tracking-tight leading-[1.08]">
              {siteSettings.siteName}
            </h1>

            <p className="text-lg sm:text-xl text-[#d4ebd7] leading-relaxed max-w-2xl font-light">
              Practical gardening inspiration, honest advice, and seasonal plant guidance crafted specifically for gardeners across the United Kingdom.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('categories-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c15] font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                id="hero-explore-guides-btn"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Gardening Guides</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('latest-articles-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm sm:text-base transition-colors cursor-pointer"
                id="hero-latest-articles-btn"
              >
                <span>Latest Articles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Unit: Homepage Top */}
      <div className="max-w-7xl mx-auto px-4">
        <AdContainer placement="homepage_top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#40916c] block mb-1">
                  Editor's Selection
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#14281c]">
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

        {/* 3. Five Primary Gardening Categories */}
        <section id="categories-section" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-wider text-[#40916c] block mb-1">
              Explore By Topic
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#14281c] mb-2">
              Gardening Categories
            </h2>
            <p className="text-sm text-[#4e6853]">
              From flower borders to houseplant propagation, discover specialized advice for your space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.slug}
                onClick={() => navigate(`/${cat.slug}`)}
                className="group relative rounded-2xl overflow-hidden border border-[#dce8dd] bg-white hover:border-[#40916c] transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div className="h-44 overflow-hidden relative bg-[#f1f6f1]">
                  <img
                    src={getOptimizedImageUrl(cat.image, 480, 75)}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={176}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/90 text-[#1b4332] shadow-xs">
                      {cat.articleCount || 6} Articles
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold font-editorial text-[#173022] group-hover:text-[#2d6a4f] transition-colors mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#465e4d] leading-relaxed line-clamp-2 mb-4">
                      {cat.description}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors mt-auto">
                    <span>View Articles</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ad Unit: Homepage Middle */}
        <AdContainer placement="homepage_middle" />

        {/* 4. Latest Articles */}
        <section id="latest-articles-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#40916c] block mb-1">
                Freshly Published
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#14281c]">
                Latest Articles
              </h2>
            </div>
            <button
              onClick={() => navigate('/gardening-tips')}
              className="text-xs sm:text-sm font-semibold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
              />
            ))}
          </div>
        </section>

        {/* 5. Seasonal UK Gardening Section */}
        <SeasonalSection />

        {/* 6. Popular Evergreen Gardening Guides */}
        {popularArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#40916c] block mb-1">
                  Community Favourites
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#14281c]">
                  Popular Gardening Guides
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
        <section className="bg-white rounded-3xl border border-[#d6e6d8] p-8 sm:p-12 shadow-sm my-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">
                Independent UK Botanical Publishing
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-[#13281a]">
                About Green Garden
              </h2>
              <p className="text-sm sm:text-base text-[#385141] leading-relaxed">
                Green Garden is dedicated to providing dependable, environmentally conscious gardening wisdom tailored exclusively for the climates and soils of Great Britain and Northern Ireland. We champion peat-free methods, biodiversity-rich wildlife sanctuaries, and realistic techniques for busy households.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/about-us')}
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs sm:text-sm font-semibold hover:bg-[#2d6a4f] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Learn More About Our Team &amp; Ethos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#f4f8f4] p-6 rounded-2xl border border-[#d0e5d3] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1b4332] text-[#d8f3dc] flex items-center justify-center mx-auto">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold font-editorial text-[#172e21]">
                30+ Expert Guides
              </div>
              <p className="text-xs text-[#52796f]">
                Fact-checked horticultural guides covering all 4 seasons in British gardens.
              </p>
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

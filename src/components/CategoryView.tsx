import React, { useState } from 'react';
import { ChevronRight, Filter, BookOpen } from 'lucide-react';
import { Category } from '../types';
import { useBlog } from '../context/BlogContext';
import { ArticleCard } from './ArticleCard';
import { AdContainer } from './AdContainer';
import { NewsletterBox } from './NewsletterBox';

interface CategoryViewProps {
  category: Category;
  navigate: (path: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, navigate }) => {
  const { articles } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Filter published articles for this category
  const categoryArticles = articles.filter(
    a => a.categorySlug === category.slug && a.status === 'published'
  );

  const totalPages = Math.ceil(categoryArticles.length / articlesPerPage) || 1;
  const currentArticles = categoryArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#52796f] mb-6">
        <button onClick={() => navigate('/')} className="hover:text-[#1b4332] cursor-pointer">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[#1b4332] font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#18392b] text-white p-8 sm:p-12 mb-10 shadow-sm">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-[#d8f3dc] mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{categoryArticles.length} UK Gardening Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-editorial mb-4">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-[#d8eedb] leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Ad Unit */}
      <AdContainer placement="homepage_top" />

      {/* Articles Grid */}
      <div className="my-8">
        {categoryArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#c2d6c5]">
            <p className="text-[#40684d] font-editorial text-xl mb-2">No articles found in this category yet.</p>
            <p className="text-sm text-neutral-500">Check back soon or add articles via the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* SEO-friendly Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-white border border-[#d2e4d4] text-[#1b4332] hover:bg-[#ebf4ec]'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {/* Ad Unit Bottom */}
      <AdContainer placement="homepage_bottom" />

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  );
};

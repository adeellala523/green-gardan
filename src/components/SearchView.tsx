import React, { useState, useMemo } from 'react';
import { Search, X, Filter, BookOpen } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { ArticleCard } from './ArticleCard';

interface SearchViewProps {
  navigate: (path: string) => void;
  onClose?: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ navigate, onClose }) => {
  const { articles, categories } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (art.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && art.categorySlug !== selectedCategory) {
        return false;
      }

      // Keyword search
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const inTitle = art.title.toLowerCase().includes(query);
      const inExcerpt = art.excerpt.toLowerCase().includes(query);
      const inContent = art.content.toLowerCase().includes(query);
      const inTags = art.tags?.some(t => t.toLowerCase().includes(query));

      return inTitle || inExcerpt || inContent || inTags;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#152e20] mb-3">
          Search Gardening Guides
        </h1>
        <p className="text-sm text-[#465f4c]">
          Find practical advice on UK plants, seasonal jobs, soil conditioning, and pest care.
        </p>

        {/* Search Bar Input */}
        <div className="relative mt-6 max-w-xl mx-auto">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords (e.g. soil, winter, lavender, pruning, shade)..."
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#c6dec9] text-[#1b4332] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1b4332] text-white'
                : 'bg-white border border-[#d2e4d4] text-[#2b4233] hover:bg-[#edf5ee]'
            }`}
          >
            All Topics ({articles.filter(a => a.status === 'published').length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-white border border-[#d2e4d4] text-[#2b4233] hover:bg-[#edf5ee]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-b border-[#e5ebe4] pb-4 mb-8 text-xs text-[#52796f]">
        <span>
          Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          {searchTerm ? ` matching "${searchTerm}"` : ''}
        </span>
        {onClose && (
          <button onClick={onClose} className="font-medium text-[#1b4332] hover:underline cursor-pointer">
            Close Search
          </button>
        )}
      </div>

      {/* Results Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#c6dec9] p-8 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-[#40916c] mx-auto mb-3 opacity-60" />
          <h2 className="text-xl font-bold font-editorial text-[#172e21] mb-2">No Matching Guides</h2>
          <p className="text-xs text-neutral-500 mb-4">
            Try adjusting your search keywords, clearing your filters, or browsing our primary categories.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onClick={() => navigate(`/${art.categorySlug}/${art.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

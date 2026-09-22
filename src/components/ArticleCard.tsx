import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { getOptimizedImageUrl, getUnsplashSrcSet } from '../utils/image';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, featured = false }) => {
  const cardImgSrc = getOptimizedImageUrl(article.featuredImage, featured ? 640 : 480, 75);
  const cardImgSrcSet = getUnsplashSrcSet(article.featuredImage, featured ? [360, 640, 800] : [320, 480, 640]);

  return (
    <article 
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-[#e8eee7] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#b7d5bb] cursor-pointer flex flex-col ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Image Container */}
      <div className={`overflow-hidden relative bg-[#f0f4f0] ${
        featured ? 'md:col-span-6 h-64 md:h-full min-h-[260px]' : 'h-52 w-full'
      }`}>
        <img
          src={cardImgSrc}
          srcSet={cardImgSrcSet}
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          alt={article.altText || article.title}
          loading="lazy"
          decoding="async"
          width={featured ? 640 : 480}
          height={featured ? 380 : 280}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/95 text-[#1b4332] shadow-sm backdrop-blur-sm">
            {article.categoryName}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className={`p-5 sm:p-6 flex flex-col justify-between flex-grow ${
        featured ? 'md:col-span-6 md:p-8' : ''
      }`}>
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-[#637d68] mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-bold font-editorial text-[#172e21] group-hover:text-[#2d6a4f] transition-colors leading-snug ${
            featured ? 'text-2xl sm:text-3xl mb-3' : 'text-xl mb-2'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#4a5f4f] line-clamp-3 leading-relaxed mb-4 font-normal">
            {article.excerpt}
          </p>

          {/* Tag Pills (OmniTools style) */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 rounded-full bg-[#f4f8f4] border border-[#dce8dd] text-[#2d6a4f] text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Read More */}
        <div className="pt-4 border-t border-[#f0f4f0] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
              className="w-6 h-6 rounded-full object-cover border border-[#c2d6c5]" 
            />
            <span className="text-xs text-[#52796f] font-medium truncate max-w-[140px]">
              {article.author.name}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors">
            <span>Read Guide</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};

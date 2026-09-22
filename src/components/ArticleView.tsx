import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  ChevronDown, 
  Bookmark, 
  Send,
  ArrowLeft
} from 'lucide-react';
import { Article } from '../types';
import { useBlog } from '../context/BlogContext';
import { AdContainer } from './AdContainer';
import { ArticleCard } from './ArticleCard';
import { NewsletterBox } from './NewsletterBox';
import { getOptimizedImageUrl, getUnsplashSrcSet } from '../utils/image';

interface ArticleViewProps {
  article: Article;
  navigate: (path: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, navigate }) => {
  const { articles } = useBlog();
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Related articles from same category, excluding current article
  const relatedArticles = articles
    .filter(a => a.categorySlug === article.categorySlug && a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  // Share handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} - Green Garden UK`;

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
  };

  // Extract H2 headings for Table of Contents
  const headings = article.content
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => line.replace('## ', '').trim());

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-[#14281c]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-[#1d3524]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#52796f] mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-[#1b4332] cursor-pointer">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <button onClick={() => navigate(`/${article.categorySlug}`)} className="hover:text-[#1b4332] cursor-pointer">
          {article.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-[#1b4332] font-semibold truncate max-w-[220px]">{article.title}</span>
      </nav>

      {/* Top Ad Unit */}
      <AdContainer placement="article_top" />

      {/* Header Info */}
      <header className="mb-8">
        <div className="mb-4">
          <button
            onClick={() => navigate(`/${article.categorySlug}`)}
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f2e8] text-[#1b4332] hover:bg-[#d0e7d2] transition-colors cursor-pointer"
          >
            {article.categoryName}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-[#14281c] leading-tight mb-5">
          {article.title}
        </h1>

        <p className="text-lg text-[#3c5242] leading-relaxed mb-6 font-serif italic">
          {article.excerpt}
        </p>

        {/* Author & Timing Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#e7eee6] text-xs sm:text-sm text-[#556e5c]">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              className="w-11 h-11 rounded-full object-cover border border-[#c2d6c5]"
            />
            <div>
              <div className="font-semibold text-[#14281c]">{article.author.name}</div>
              <div className="text-[11px] text-[#6b8271]">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#40916c]" />
              <span>Published: {article.publishDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#40916c]" />
              <span>{article.readingTime}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-10 rounded-2xl overflow-hidden shadow-sm bg-[#eaf0ea]">
        <img
          src={getOptimizedImageUrl(article.featuredImage, 1000, 80)}
          srcSet={getUnsplashSrcSet(article.featuredImage, [480, 800, 1200])}
          sizes="(max-width: 768px) 100vw, 900px"
          alt={article.altText || article.title}
          width={1000}
          height={500}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-auto max-h-[500px] object-cover"
        />
        {article.altText && (
          <p className="text-xs text-neutral-500 py-2 px-4 italic text-center bg-[#f9fbf9] border-t border-[#edf2ed]">
            {article.altText}
          </p>
        )}
      </div>

      {/* Table of Contents (for structured guides) */}
      {headings.length > 2 && (
        <div className="bg-[#f4f8f4] border border-[#d2e5d4] rounded-2xl p-6 mb-10">
          <div className="font-bold text-sm uppercase tracking-wider text-[#1b4332] mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#2d6a4f]" />
            <span>Table of Contents</span>
          </div>
          <ul className="space-y-2 text-sm text-[#2b4233]">
            {headings.map((h, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="text-xs text-[#52796f] font-mono">{i + 1}.</span>
                <span className="hover:text-[#1b4332] font-medium">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body Content */}
      <div className="text-[#233529] font-sans leading-relaxed text-[15px] sm:text-base">
        {article.content.split('\n\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          const lines = trimmed.split('\n');
          const firstLine = lines[0].trim();

          // Render H2
          if (firstLine.startsWith('## ')) {
            const headingText = firstLine.replace(/^##\s+/, '');
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-[#172e20] mt-9 mb-3 pt-4 border-t border-[#ebf2ea] first:border-t-0 first:pt-0">
                  {headingText}
                </h2>
                {remainingLines && (
                  <p className="my-4 text-[#293d2e] leading-relaxed font-sans font-normal text-[15px] sm:text-base">
                    {renderFormattedText(remainingLines)}
                  </p>
                )}
              </React.Fragment>
            );
          }

          // Render H3
          if (firstLine.startsWith('### ')) {
            const headingText = firstLine.replace(/^###\s+/, '');
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#1d3827] mt-6 mb-2">
                  {headingText}
                </h3>
                {remainingLines && (
                  <p className="my-4 text-[#293d2e] leading-relaxed font-sans font-normal text-[15px] sm:text-base">
                    {renderFormattedText(remainingLines)}
                  </p>
                )}
              </React.Fragment>
            );
          }

          // Render Divider
          if (trimmed === '---') {
            return <hr key={index} className="my-8 border-[#e4eee3]" />;
          }

          // Render Bullet List
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ul key={index} className="my-4 space-y-2 list-disc pl-6 text-[#293d2e] text-[15px] sm:text-base">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(item.replace(/^[-*]\s+/, ''))}
                  </li>
                ))}
              </ul>
            );
          }

          // Render Numbered List
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ol key={index} className="my-4 space-y-2 list-decimal pl-6 text-[#293d2e] text-[15px] sm:text-base">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(item.replace(/^\d+\.\s+/, ''))}
                  </li>
                ))}
              </ol>
            );
          }

          // Render In-Content Ad after paragraph 3
          const isMidContent = index === 3;

          return (
            <React.Fragment key={index}>
              <p className="my-4 text-[#293d2e] leading-relaxed font-sans font-normal text-[15px] sm:text-base">
                {renderFormattedText(trimmed)}
              </p>
              {isMidContent && <AdContainer placement="article_in_content" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Social Sharing Bar */}
      <div className="my-10 p-5 rounded-2xl bg-[#f6faf6] border border-[#dceade] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1b4332]">
          <Share2 className="w-4 h-4 text-[#2d6a4f]" />
          <span>Share this UK gardening guide</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={shareFacebook}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#cbe0ce] text-xs font-medium text-[#1b4332] hover:bg-[#eaf4eb] transition-colors cursor-pointer"
          >
            Facebook
          </button>
          <button
            onClick={shareTwitter}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#cbe0ce] text-xs font-medium text-[#1b4332] hover:bg-[#eaf4eb] transition-colors cursor-pointer"
          >
            X / Twitter
          </button>
          <button
            onClick={shareWhatsApp}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#cbe0ce] text-xs font-medium text-[#1b4332] hover:bg-[#eaf4eb] transition-colors cursor-pointer"
          >
            WhatsApp
          </button>
          <button
            onClick={copyLink}
            className="px-3.5 py-1.5 rounded-lg bg-[#1b4332] text-white text-xs font-medium hover:bg-[#2d6a4f] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="my-12 pt-8 border-t border-[#e2ece1]">
          <div className="flex items-center gap-2.5 mb-6">
            <HelpCircle className="w-6 h-6 text-[#2d6a4f]" />
            <h2 className="text-2xl font-bold font-editorial text-[#14291d]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {article.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-[#d7e6d9] rounded-xl overflow-hidden bg-white shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 font-semibold text-sm sm:text-base text-[#183122] flex justify-between items-center gap-4 hover:bg-[#f6f9f6] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#40916c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#354f3d] leading-relaxed border-t border-neutral-100 bg-[#fafcfa]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Author Bio Box */}
      <div className="my-10 p-6 rounded-2xl bg-[#edf5ee] border border-[#d0e5d3] flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#1b4332] shrink-0"
        />
        <div className="text-center sm:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-[#40916c] mb-1">
            Written by
          </div>
          <h3 className="text-lg font-bold font-editorial text-[#12281a] mb-2">
            {article.author.name}
          </h3>
          <p className="text-sm text-[#385140] leading-relaxed">
            {article.author.bio}
          </p>
        </div>
      </div>

      {/* Bottom Ad Unit */}
      <AdContainer placement="article_bottom" />

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="my-14 pt-8 border-t border-[#e2ece1]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
              More Guides in {article.categoryName}
            </h2>
            <button
              onClick={() => navigate(`/${article.categorySlug}`)}
              className="text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                onClick={() => navigate(`/${rel.categorySlug}/${rel.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterBox />
    </article>
  );
};

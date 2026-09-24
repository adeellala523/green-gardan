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
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Article } from '../types';
import { useBlog } from '../context/BlogContext';
import { AdContainer } from './AdContainer';
import { ArticleCard } from './ArticleCard';
import { NewsletterBox } from './NewsletterBox';
import { getOptimizedImageUrl, getUnsplashSrcSet, DEFAULT_FALLBACK_IMAGE } from '../utils/image';

interface ArticleViewProps {
  article: Article;
  navigate: (path: string) => void;
}

const slugifyHeading = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const ArticleView: React.FC<ArticleViewProps> = ({ article, navigate }) => {
  const { articles, siteSettings } = useBlog();
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Related articles from same category, excluding current article
  const relatedArticles = articles
    .filter(a => a.categorySlug === article.categorySlug && a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  // Share handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} - ${siteSettings.siteName || 'Green Gardan UK'}`;

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
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-[#14281c]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-[#1d3524]">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-[#ebf3ec] text-[#1b4332] font-mono text-xs">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderTable = (tableMarkdown: string, key: number) => {
    const lines = tableMarkdown.trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return null;
    const parseRow = (line: string) => line.split('|').slice(1, -1).map(c => c.trim());
    const headerCells = parseRow(lines[0]);
    const isSeparator = (line: string) => /^[|\s-:]+$/.test(line);
    const dataLines = lines.slice(1).filter(l => !isSeparator(l));

    return (
      <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-[#d2e5d4] shadow-2xs bg-white">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#eef6ef] border-b border-[#cde2cf] text-[#14281c] font-bold">
              {headerCells.map((h, idx) => (
                <th key={idx} className="py-3.5 px-4 sm:px-5">
                  {renderFormattedText(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8f1e9] text-[#293d2e]">
            {dataLines.map((row, rIdx) => {
              const cells = parseRow(row);
              return (
                <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-[#fcfdfc]' : 'bg-white'}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3 px-4 sm:px-5 leading-relaxed">
                      {renderFormattedText(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Structured Data Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.metaDescription,
    image: [article.featuredImage],
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: siteSettings.siteName || 'Green Gardan',
      url: siteSettings.canonicalBaseUrl || 'https://greengardan.co.uk',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

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

        {/* E-E-A-T Trust & Fact-Check Callout */}
        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-[#eef7ee] border border-[#cbe4ce] text-xs text-[#1b4332] mb-6">
          <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" />
          <span><strong>Fact-Checked &amp; RHS Standards Reviewed:</strong> Written by verified UK horticultural specialists for British climate zones and peat-free practice.</span>
        </div>

        {/* Author & Timing Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#e7eee6] text-xs sm:text-sm text-[#556e5c]">
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <img
              src={article.author.avatar}
              alt={article.author.name}
              width={46}
              height={46}
              loading="lazy"
              decoding="async"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#52b788] group-hover:border-[#1b4332] transition-colors shrink-0"
            />
            <div>
              <div className="font-semibold text-[#14281c] group-hover:text-[#2d6a4f] transition-colors flex items-center gap-1.5">
                <span>{article.author.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#e7f2e8] text-[#1b4332] font-semibold border border-[#cde2cf]">Author</span>
              </div>
              <div className="text-[11px] text-[#6b8271] font-medium">{article.author.role}</div>
            </div>
          </button>

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
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.srcset = '';
            target.src = DEFAULT_FALLBACK_IMAGE;
          }}
          className="w-full h-auto max-h-[500px] object-cover"
        />
        {article.altText && (
          <p className="text-xs text-neutral-500 py-2 px-4 italic text-center bg-[#f9fbf9] border-t border-[#edf2ed]">
            {article.altText}
          </p>
        )}
      </div>

      {/* Table of Contents (Clickable with smooth jump links) */}
      {headings.length > 1 && (
        <div className="bg-[#f4f8f4] border border-[#d2e5d4] rounded-2xl p-6 mb-10 shadow-2xs">
          <div className="font-bold text-sm uppercase tracking-wider text-[#1b4332] mb-3.5 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#2d6a4f]" />
            <span>Table of Contents (Jump to Section)</span>
          </div>
          <ul className="space-y-2 text-sm text-[#2b4233]">
            {headings.map((h, i) => {
              const targetId = slugifyHeading(h);
              return (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="text-xs text-[#52796f] font-mono">{i + 1}.</span>
                  <button
                    onClick={() => {
                      const el = document.getElementById(targetId);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-left text-[#1b4332] hover:text-[#2d6a4f] hover:underline font-medium cursor-pointer"
                  >
                    {h}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Article Body Content */}
      <div className="text-[#233529] font-sans leading-relaxed text-[15px] sm:text-base">
        {article.content.split('\n\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          // Check if it's a Markdown Table
          if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
            return renderTable(trimmed, index);
          }

          // Check if it's a Blockquote / Pro Tip
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed.replace(/^>\s?/gm, '');
            return (
              <div 
                key={index} 
                className="my-7 p-5 rounded-2xl bg-[#f2f8f3] border-l-4 border-[#2d6a4f] text-[#1b4332] text-[15px] sm:text-base leading-relaxed shadow-2xs"
              >
                {renderFormattedText(quoteContent)}
              </div>
            );
          }

          const lines = trimmed.split('\n');
          const firstLine = lines[0].trim();

          // Render H2
          if (firstLine.startsWith('## ')) {
            const headingText = firstLine.replace(/^##\s+/, '');
            const targetId = slugifyHeading(headingText);
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h2 
                  id={targetId}
                  className="scroll-mt-24 text-xl sm:text-2xl font-bold font-editorial text-[#172e20] mt-10 mb-3 pt-4 border-t border-[#ebf2ea] first:border-t-0 first:pt-0"
                >
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
            const targetId = slugifyHeading(headingText);
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h3 
                  id={targetId}
                  className="scroll-mt-24 text-lg sm:text-xl font-bold font-editorial text-[#1d3827] mt-7 mb-2"
                >
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
      <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#edf5ee] border border-[#d0e5d3] flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1b4332] shrink-0"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#40916c]">
              Written by {article.author.role}
            </span>
            <button
              onClick={() => navigate('/about')}
              className="text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f] underline cursor-pointer"
            >
              Meet Our Editorial Team →
            </button>
          </div>
          <h3 className="text-xl font-bold font-editorial text-[#12281a] mb-2">
            {article.author.name}
          </h3>
          <p className="text-sm text-[#385140] leading-relaxed mb-3">
            {article.author.bio}
          </p>
          <div className="pt-3 border-t border-[#d8e8da] flex items-center justify-center sm:justify-start gap-2 text-xs text-[#52796f]">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" />
            <span>Fact-checked against UK RHS standards, soil conservation policies, and 100% peat-free guidelines.</span>
          </div>
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

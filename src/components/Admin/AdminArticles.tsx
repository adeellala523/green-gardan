import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  FileText, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { Article } from '../../types';
import { useBlog } from '../../context/BlogContext';

interface AdminArticlesProps {
  initialMode?: 'list' | 'add';
  onViewArticle?: (slug: string) => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({ initialMode = 'list', onViewArticle }) => {
  const { articles, categories, addArticle, updateArticle, deleteArticle, toggleArticleStatus } = useBlog();
  
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    altText: '',
    readingTime: '5 min read',
    tags: ['UK Gardening'],
    status: 'published',
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    faqs: [
      { question: '', answer: '' }
    ]
  });

  const [formMsg, setFormMsg] = useState('');

  const filteredArticles = articles.filter(art => {
    if (selectedCategory !== 'all' && art.categorySlug !== selectedCategory) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return art.title.toLowerCase().includes(q) || art.categoryName.toLowerCase().includes(q);
  });

  const openAddForm = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      categorySlug: categories[0]?.slug || 'gardening-tips',
      categoryName: categories[0]?.name || 'Gardening Tips',
      excerpt: '',
      content: '## Introduction\nWrite your UK gardening guide introduction here...\n\n---\n\n## 1. Key Principle\nExplain your tips with specific British climate and soil references.\n\n---\n\n## Summary\nProvide a concise takeaway.',
      featuredImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
      altText: '',
      readingTime: '5 min read',
      tags: ['UK Gardening', 'Beginners'],
      status: 'published',
      seoTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      faqs: [
        { question: 'What is the best time of year to plant this in the UK?', answer: 'Spring (March to May) or autumn (September to October) is generally recommended.' }
      ]
    });
    setMode('edit');
    setFormMsg('');
  };

  const openEditForm = (art: Article) => {
    setEditingArticle(art);
    setFormData({
      ...art,
      tags: [...art.tags],
      faqs: art.faqs ? [...art.faqs] : []
    });
    setMode('edit');
    setFormMsg('');
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingArticle ? prev.slug : slug,
      seoTitle: editingArticle ? prev.seoTitle : `${title} | Green Gardan UK`
    }));
  };

  const handleCategoryChange = (catSlug: string) => {
    const cat = categories.find(c => c.slug === catSlug);
    setFormData(prev => ({
      ...prev,
      categorySlug: catSlug,
      categoryName: cat?.name || 'Gardening'
    }));
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const updated = [...(prev.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) {
      setFormMsg('Please provide at least a title and article content.');
      return;
    }

    if (editingArticle) {
      updateArticle(editingArticle.id, formData);
      setFormMsg('Article successfully updated!');
    } else {
      addArticle({
        title: formData.title || 'Untitled',
        slug: formData.slug || `article-${Date.now()}`,
        categorySlug: formData.categorySlug || 'gardening-tips',
        categoryName: formData.categoryName || 'Gardening Tips',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
        altText: formData.altText || formData.title || '',
        author: {
          id: 'author-editorial',
          name: 'Green Gardan Editorial Team',
          role: 'Horticultural Writers & UK Gardeners',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          bio: 'Passionate British gardeners sharing actionable advice.'
        },
        publishDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        readingTime: formData.readingTime || '5 min read',
        tags: formData.tags || ['UK Gardening'],
        status: formData.status || 'published',
        seoTitle: formData.seoTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        focusKeyword: formData.focusKeyword || '',
        canonicalUrl: formData.canonicalUrl || '',
        faqs: formData.faqs?.filter(f => f.question.trim() && f.answer.trim()) || []
      });
      setFormMsg('New article published successfully!');
    }

    setTimeout(() => {
      setMode('list');
      setEditingArticle(null);
    }, 600);
  };

  if (mode === 'edit') {
    return (
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#40916c]">
              {editingArticle ? 'Edit Guide' : 'Create Guide'}
            </span>
            <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
              {editingArticle ? `Editing: ${editingArticle.title}` : 'Add New UK Gardening Article'}
            </h2>
          </div>
          <button
            onClick={() => setMode('list')}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
          >
            Cancel &amp; Return
          </button>
        </div>

        {formMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#40916c]" />
            <span>{formMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Protect UK Roses from Winter Black Spot"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="how-to-protect-uk-roses-from-winter-black-spot"
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs font-mono text-neutral-600 bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Compelling 2-sentence summary that appears on cards and search results..."
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>
            </div>

            {/* Side Controls */}
            <div className="bg-[#f9fbf9] p-5 rounded-xl border border-[#e2ece2] space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-800 bg-white"
                >
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-800 bg-white"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Private)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Estimated Reading Time
                </label>
                <input
                  type="text"
                  value={formData.readingTime}
                  onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                  placeholder="e.g. 6 min read"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Image ALT Text
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="Descriptive text for accessibility and SEO"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-700"
                />
              </div>
            </div>
          </div>

          {/* Full Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                Article Body Content (Markdown Supported) *
              </label>
              <span className="text-[11px] text-neutral-400">
                Use ## for H2, ### for H3, - for bullet lists, and --- for dividers
              </span>
            </div>
            <textarea
              rows={16}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-4 rounded-xl border border-neutral-300 font-mono text-xs text-neutral-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          {/* FAQs Manager */}
          <div className="border border-neutral-200 rounded-xl p-5 bg-[#fafbfa]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#14281c]">Frequently Asked Questions (FAQ Schema)</h4>
                <p className="text-xs text-neutral-500">Provide direct answers for rich Google search snippets.</p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-3 py-1.5 rounded-lg bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold hover:bg-[#d5ead7] cursor-pointer"
              >
                + Add FAQ Item
              </button>
            </div>

            <div className="space-y-3">
              {(formData.faqs || []).map((faq, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-neutral-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 text-xs"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    placeholder="Question (e.g. When should I cut back lavender?)"
                    className="w-[90%] px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    placeholder="Concise, practical answer..."
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="border border-neutral-200 rounded-xl p-5 bg-[#f6f9f6]">
            <h4 className="text-sm font-bold text-[#14281c] mb-3">SEO &amp; Search Engine Optimization</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Optimised headline for Google"
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Focus Keyword</label>
                <input
                  type="text"
                  value={formData.focusKeyword}
                  onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                  placeholder="e.g. winter rose care UK"
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="/gardening-tips/your-slug"
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setMode('list')}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              {editingArticle ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
            Article Management ({articles.length})
          </h2>
          <p className="text-xs text-[#52796f]">
            Create, edit, toggle draft/published status, and manage SEO fields.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          id="admin-add-article-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece2] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f7f9f7] text-[#1b4332] font-semibold border-b border-[#e5ece4]">
                <th className="py-3.5 px-4">Title &amp; Slug</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-[#fbfdfb] transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-bold text-[#14281c] truncate">{art.title}</div>
                    <div className="text-[11px] text-neutral-400 font-mono truncate">/{art.categorySlug}/{art.slug}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-[#e8f3e8] text-[#1b4332] font-medium text-[11px]">
                      {art.categoryName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleArticleStatus(art.id)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                        art.status === 'published'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {art.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500">
                    {art.publishDate}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    {onViewArticle && (
                      <button
                        onClick={() => onViewArticle(`/${art.categorySlug}/${art.slug}`)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-[#1b4332] hover:bg-neutral-100 cursor-pointer"
                        title="View Public Guide"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(art)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-[#1b4332] hover:bg-neutral-100 cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                          deleteArticle(art.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, Layers, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { useBlog } from '../../context/BlogContext';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useBlog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    seoTitle: '',
    metaDescription: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setIsAdding(false);
    setFormData({ ...cat });
    setMsg('');
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?auto=format&fit=crop&w=800&q=80',
      seoTitle: '',
      metaDescription: ''
    });
    setMsg('');
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || slug,
      seoTitle: `${name} | Green Garden UK`
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.slug?.trim()) return;

    if (isAdding) {
      addCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        image: formData.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?auto=format&fit=crop&w=800&q=80',
        seoTitle: formData.seoTitle || `${formData.name} Guides | Green Garden`,
        metaDescription: formData.metaDescription || formData.description
      });
      setMsg('New category added successfully!');
    } else if (editingId) {
      updateCategory(editingId, formData);
      setMsg('Category updated successfully!');
    }

    setTimeout(() => {
      setIsAdding(false);
      setEditingId(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
            Category Management ({categories.length})
          </h2>
          <p className="text-xs text-[#52796f]">
            Organize UK gardening topics and optimize category landing pages for search engines.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#40916c]" />
          <span>{msg}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl border border-[#cde2cf] p-6 shadow-xs animate-in fade-in">
          <h3 className="text-lg font-bold font-editorial text-[#14281c] mb-4">
            {isAdding ? 'Create New Category' : 'Edit Category Details'}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Header Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Meta Description</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] cursor-pointer"
              >
                {isAdding ? 'Save Category' : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-[#e2ece2] overflow-hidden shadow-2xs flex flex-col justify-between">
            <div className="h-32 relative bg-[#f1f6f1]">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full bg-white/95 text-[11px] font-bold text-[#1b4332] shadow-xs">
                  {cat.articleCount || 0} articles
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#14281c] mb-1">
                  {cat.name}
                </h3>
                <div className="text-[11px] font-mono text-[#52796f] mb-2">
                  /{cat.slug}
                </div>
                <p className="text-xs text-[#4a5f4f] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"? Articles will remain but should be recategorised.`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

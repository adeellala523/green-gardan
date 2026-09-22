import React, { useState } from 'react';
import { Edit, Check, FileText } from 'lucide-react';
import { PageContent } from '../../types';
import { useBlog } from '../../context/BlogContext';

export const AdminPages: React.FC = () => {
  const { staticPages, updateStaticPage } = useBlog();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageContent>>({
    title: '',
    subtitle: '',
    content: ''
  });
  const [msg, setMsg] = useState('');

  const pagesList: PageContent[] = Object.values(staticPages);

  const handleStartEdit = (p: PageContent) => {
    setEditingSlug(p.slug);
    setFormData({
      title: p.title,
      subtitle: p.subtitle,
      content: p.content
    });
    setMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlug) return;

    updateStaticPage(editingSlug, {
      title: formData.title,
      subtitle: formData.subtitle,
      content: formData.content,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    setMsg('Page content updated successfully!');
    setTimeout(() => {
      setEditingSlug(null);
      setMsg('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          Trust &amp; Legal Pages Management
        </h2>
        <p className="text-xs text-[#52796f]">
          Edit content for About Us, Contact Us, Privacy Policy, Terms, Cookie Policy, and Disclaimer.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#40916c]" />
          <span>{msg}</span>
        </div>
      )}

      {editingSlug ? (
        <div className="bg-white rounded-2xl border border-[#cde2cf] p-6 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
            <h3 className="text-lg font-bold font-editorial text-[#14281c]">
              Editing Page: {staticPages[editingSlug]?.title}
            </h3>
            <button
              onClick={() => setEditingSlug(null)}
              className="text-xs text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Page Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Body Content (Markdown Supported)
              </label>
              <textarea
                rows={16}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-4 rounded-xl border border-neutral-300 font-mono text-xs text-neutral-800 focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSlug(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] cursor-pointer"
              >
                Update Page
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagesList.map((p) => (
            <div key={p.slug} className="bg-white rounded-2xl border border-[#e2ece2] p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#2d6a4f] mb-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-[11px] font-mono text-[#52796f]">/{p.slug}</span>
                </div>
                <h3 className="text-base font-bold font-editorial text-[#14281c] mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-[#52796f] line-clamp-2 mb-4">
                  {p.subtitle || 'Essential legal or editorial page for AdSense compliance.'}
                </p>
                <div className="text-[11px] text-neutral-400">
                  Updated: {p.lastUpdated}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 mt-4 flex justify-end">
                <button
                  onClick={() => handleStartEdit(p)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

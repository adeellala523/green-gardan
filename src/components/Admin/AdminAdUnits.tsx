import React, { useState } from 'react';
import { Plus, Edit, Check, DollarSign, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdUnit } from '../../types';
import { useBlog } from '../../context/BlogContext';

export const AdminAdUnits: React.FC = () => {
  const { adUnits, updateAdUnit, addAdUnit, toggleAdUnitStatus, deleteAdUnit } = useBlog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState<Partial<AdUnit>>({
    name: '',
    slotId: '',
    format: 'responsive',
    placement: 'homepage_middle',
    device: 'all',
    status: 'active',
    customLabel: 'Advertisement'
  });

  const handleStartEdit = (unit: AdUnit) => {
    setEditingId(unit.id);
    setIsAdding(false);
    setFormData({ ...unit });
    setMsg('');
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: '',
      slotId: '1234567890',
      format: 'responsive',
      placement: 'article_in_content',
      device: 'all',
      status: 'active',
      customLabel: 'Advertisement'
    });
    setMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (isAdding) {
      addAdUnit({
        name: formData.name,
        slotId: formData.slotId || '1234567890',
        format: formData.format || 'responsive',
        placement: formData.placement || 'homepage_middle',
        device: formData.device || 'all',
        status: formData.status === 'disabled' ? 'inactive' : (formData.status || 'active'),
        customLabel: formData.customLabel || formData.label || 'Advertisement'
      });
      setMsg('Ad unit added successfully!');
    } else if (editingId) {
      updateAdUnit(editingId, {
        ...formData,
        status: formData.status === 'disabled' ? 'inactive' : formData.status
      });
      setMsg('Ad unit updated successfully!');
    }

    setTimeout(() => {
      setIsAdding(false);
      setEditingId(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
            Ad Placement Units ({adUnits.length})
          </h2>
          <p className="text-xs text-[#52796f]">
            Enable or disable specific slots, update AdSense slot IDs, and adjust display formats.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ad Unit</span>
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
            {isAdding ? 'Configure New Ad Unit' : 'Edit Ad Unit Slot'}
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Unit Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Header Leaderboard"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">AdSense Slot ID (data-ad-slot)</label>
              <input
                type="text"
                value={formData.slotId}
                onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
                placeholder="10-digit Slot ID from Google"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Layout Placement *</label>
              <select
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
              >
                <option value="homepage_top">Homepage Top</option>
                <option value="homepage_middle">Homepage Middle</option>
                <option value="homepage_bottom">Homepage Bottom</option>
                <option value="article_top">Article Top (Below Header)</option>
                <option value="article_in_content">Article In-Content (Mid-Read)</option>
                <option value="article_bottom">Article Bottom (Above Related)</option>
                <option value="sidebar">Sidebar Sticky Unit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Ad Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
              >
                <option value="responsive">Responsive (Recommended)</option>
                <option value="rectangle">Medium Rectangle (300x250)</option>
                <option value="leaderboard">Leaderboard (728x90)</option>
                <option value="fluid">In-Article Fluid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Target Devices</label>
              <select
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
              >
                <option value="all">All Devices (Mobile &amp; Desktop)</option>
                <option value="desktop">Desktop Only</option>
                <option value="mobile">Mobile Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
              >
                <option value="active">Active (Serving)</option>
                <option value="disabled">Disabled (Hidden)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
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
                {isAdding ? 'Save Ad Unit' : 'Update Unit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ad Units Table */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f7f9f7] text-[#1b4332] font-semibold border-b border-[#e5ece4]">
              <th className="py-3.5 px-4">Placement &amp; Name</th>
              <th className="py-3.5 px-4">Slot ID</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4">Device</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {adUnits.map((unit) => (
              <tr key={unit.id} className="hover:bg-[#fbfdfb] transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#14281c]">
                  <div>{unit.name}</div>
                  <div className="text-[11px] text-[#52796f] font-mono capitalize">
                    {unit.placement.replace(/_/g, ' ')}
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-neutral-600">
                  {unit.slotId}
                </td>

                <td className="py-3.5 px-4 capitalize text-neutral-600">
                  {unit.format}
                </td>

                <td className="py-3.5 px-4 capitalize text-neutral-600">
                  {unit.device}
                </td>

                <td className="py-3.5 px-4">
                  <button
                    onClick={() => toggleAdUnitStatus(unit.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      unit.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{unit.status === 'active' ? 'Active' : 'Disabled'}</span>
                  </button>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleStartEdit(unit)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-[#1b4332] hover:bg-neutral-100 cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ad unit "${unit.name}"?`)) {
                        deleteAdUnit(unit.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete"
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
  );
};

import React, { useState } from 'react';
import { Settings, Check, CloudSun, Plus, Trash2, Key } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useBlog();

  const [settings, setSettings] = useState({ ...siteSettings });
  const [seasonal, setSeasonal] = useState({ ...siteSettings.seasonalAdvice });
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      ...settings,
      seasonalAdvice: seasonal
    });
    setMsg('Site settings and seasonal advice updated successfully!');
    setTimeout(() => setMsg(''), 4000);
  };

  const handleAddJob = () => {
    setSeasonal(prev => ({
      ...prev,
      jobs: [...prev.jobs, 'New seasonal gardening job']
    }));
  };

  const handleJobChange = (index: number, val: string) => {
    setSeasonal(prev => {
      const updated = [...prev.jobs];
      updated[index] = val;
      return { ...prev, jobs: updated };
    });
  };

  const handleRemoveJob = (index: number) => {
    setSeasonal(prev => ({
      ...prev,
      jobs: prev.jobs.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          General Site Configuration
        </h2>
        <p className="text-xs text-[#52796f]">
          Manage publication details, seasonal homepage advice, and contact configuration.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#e7f2e8] text-[#1b4332] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#40916c]" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Site Details */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold font-editorial text-[#14281c] border-b border-neutral-100 pb-2">
            Publication Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Website Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || settings.siteTagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value, siteTagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">Editorial Description</label>
              <textarea
                rows={2}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Footer Copyright Text</label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* UK Seasonal Gardening Advice Manager */}
        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <CloudSun className="w-5 h-5 text-[#2d6a4f]" />
            <h3 className="text-base font-bold font-editorial text-[#14281c]">
              Homepage Seasonal Gardening Section Manager
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Active Season Tag</label>
              <input
                type="text"
                value={seasonal.season}
                onChange={(e) => setSeasonal({ ...seasonal, season: e.target.value as any })}
                placeholder="e.g. Early Autumn (September - October)"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Section Title</label>
              <input
                type="text"
                value={seasonal.title}
                onChange={(e) => setSeasonal({ ...seasonal, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">Overview &amp; Guidance</label>
              <textarea
                rows={3}
                value={seasonal.highlight}
                onChange={(e) => setSeasonal({ ...seasonal, highlight: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>
          </div>

          {/* Jobs Checklist */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-neutral-700">
                Priority Jobs for British Gardeners
              </label>
              <button
                type="button"
                onClick={handleAddJob}
                className="text-xs text-[#2d6a4f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2">
              {seasonal.jobs.map((job, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => handleJobChange(idx, e.target.value)}
                    className="flex-grow px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveJob(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};

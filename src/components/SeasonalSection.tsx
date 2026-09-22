import React from 'react';
import { CloudSun, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const SeasonalSection: React.FC = () => {
  const { siteSettings } = useBlog();
  const { seasonalAdvice } = siteSettings;

  return (
    <section className="bg-gradient-to-br from-[#ebf5ec] via-[#f3f9f4] to-[#e4f1e5] border border-[#d2e7d5] rounded-3xl p-6 sm:p-10 my-12 shadow-sm overflow-hidden relative">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d8eedb]/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-[#d8f3dc] text-xs font-semibold tracking-wide uppercase">
            <CloudSun className="w-3.5 h-3.5" />
            <span>UK Seasonal Guide — {seasonalAdvice.season}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#2d6a4f] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated for Current British Weather</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#122b20] mb-3">
          {seasonalAdvice.title}
        </h2>

        <p className="text-base text-[#2e4736] leading-relaxed mb-8 max-w-3xl">
          {seasonalAdvice.highlight}
        </p>

        {/* Priority Jobs Checklist */}
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 border border-[#cde2d0] shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b4332] mb-4">
            <Sparkles className="w-4 h-4 text-[#40916c]" />
            <span>Priority Jobs for Your Garden This Month</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {seasonalAdvice.jobs.map((job, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-[#243b2c]">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <span className="leading-snug">{job}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

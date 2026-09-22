import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

export const NewsletterBox: React.FC = () => {
  const { subscribeNewsletter } = useBlog();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const res = subscribeNewsletter(email);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-[#1b4332] text-white rounded-3xl p-8 sm:p-12 my-14 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2d6a4f]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d6a4f] text-[#d8f3dc] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#74c69d]" />
          <span>Weekly British Gardening Digest</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold font-editorial mb-3 text-white">
          Gardening Wisdom, Directly to Your Inbox
        </h2>

        <p className="text-sm sm:text-base text-[#c5dac8] leading-relaxed mb-8">
          Join over 15,000 UK gardeners. Receive timely seasonal checklists, plant alerts for your region, and sustainable gardening advice every Friday.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-grow">
            <Mail className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-[#1b4332] placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#74c69d] shadow-inner"
              disabled={isSubmitting || status.type === 'success'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || status.type === 'success'}
            className="px-6 py-3 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c15] font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            {isSubmitting ? 'Joining...' : status.type === 'success' ? 'Subscribed!' : 'Subscribe Free'}
          </button>
        </form>

        {status.type === 'success' && (
          <div className="mt-4 p-3 rounded-xl bg-[#2d6a4f]/80 text-[#d8f3dc] text-xs inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-[#74c69d]" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="mt-4 p-3 rounded-xl bg-red-900/60 text-red-200 text-xs inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{status.message}</span>
          </div>
        )}

        <p className="text-[11px] text-[#95b89b] mt-4">
          Strictly no spam. We respect your privacy in accordance with UK GDPR. Unsubscribe with one click anytime.
        </p>
      </div>
    </div>
  );
};

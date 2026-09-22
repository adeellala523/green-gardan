import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ChevronRight, Shield, Send } from 'lucide-react';
import { PageContent } from '../types';
import { useBlog } from '../context/BlogContext';

interface PageViewProps {
  page: PageContent;
  navigate: (path: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({ page, navigate }) => {
  const { submitContactMessage } = useBlog();

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    const success = submitContactMessage(formData);
    if (success) {
      setSubmitted(true);
      setErrorMsg('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#52796f] mb-6">
        <button onClick={() => navigate('/')} className="hover:text-[#1b4332] cursor-pointer">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[#1b4332] font-semibold">{page.title}</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-[#e5ece4]">
        <h1 className="text-2xl sm:text-4xl font-bold font-editorial text-[#14281c] mb-3 leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-[15px] sm:text-base text-[#415a48] font-normal leading-relaxed">
            {page.subtitle}
          </p>
        )}
        <div className="text-xs text-[#6e8a75] mt-3">
          Last reviewed and updated: {page.lastUpdated}
        </div>
      </header>

      {/* Main Page Editorial Body with calibrated font sizes and distinct headings */}
      <div className="text-[#233529] font-sans mb-12">
        {page.content.split('\n\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          const lines = trimmed.split('\n');
          const firstLine = lines[0].trim();

          if (firstLine.startsWith('## ')) {
            const headingText = firstLine.replace(/^##\s+/, '');
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-[#172e20] mt-8 mb-3 pt-3 border-t border-[#edf4ee] first:border-t-0 first:pt-0">
                  {headingText}
                </h2>
                {remainingLines && (
                  <p className="mb-4 text-[15px] sm:text-base text-[#293d2e] leading-relaxed font-sans font-normal">
                    {renderFormattedText(remainingLines)}
                  </p>
                )}
              </React.Fragment>
            );
          }

          if (firstLine.startsWith('### ')) {
            const headingText = firstLine.replace(/^###\s+/, '');
            const remainingLines = lines.slice(1).join('\n').trim();
            return (
              <React.Fragment key={index}>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#1d3827] mt-6 mb-2">
                  {headingText}
                </h3>
                {remainingLines && (
                  <p className="mb-4 text-[15px] sm:text-base text-[#293d2e] leading-relaxed font-sans font-normal">
                    {renderFormattedText(remainingLines)}
                  </p>
                )}
              </React.Fragment>
            );
          }

          if (trimmed === '---') {
            return <hr key={index} className="my-6 border-[#e4eee3]" />;
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ul key={index} className="my-3 space-y-2 list-disc pl-6 text-[15px] sm:text-base text-[#293d2e]">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(item.replace(/^[-*]\s+/, ''))}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={index} className="mb-4 text-[15px] sm:text-base text-[#293d2e] leading-relaxed font-sans font-normal">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>

      {/* If this is Contact Us, render the interactive contact form */}
      {page.slug === 'contact-us' && (
        <section className="bg-white rounded-3xl border border-[#d3e5d5] p-6 sm:p-10 shadow-sm mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e7f2e8] flex items-center justify-center text-[#1b4332]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-editorial text-[#162f20]">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#52796f]">
                Messages are stored securely and received directly in our editorial inbox.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-[#eaf5eb] border border-[#c3dec6] text-[#1b4332] text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-[#40916c] mb-3" />
              <h3 className="text-xl font-bold font-editorial mb-1">Message Received!</h3>
              <p className="text-sm text-[#3a5843] max-w-md mx-auto">
                Thank you for getting in touch with Green Garden. Our editorial team reviews messages regularly and will reply to your email address soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f3727] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fiona Campbell"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cddfc0] text-sm text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f3727] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="fiona@example.co.uk"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cddfc0] text-sm text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f3727] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question on winter pruning"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cddfc0] text-sm text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f3727] mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your gardening query, correction, or feedback here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cddfc0] text-sm text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#40916c]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-neutral-400">
                  Protected by UK GDPR. Information is never shared.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </div>
  );
};

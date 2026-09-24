import React from 'react';
import { Sprout, Shield, ArrowUp, Mail, Lock, Infinity, ChevronRight } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { siteSettings, categories } = useBlog();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#122b20] text-[#e7f2e8] border-t border-[#1b4332] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#23533e]">
          
          {/* Brand Info & Social Icons */}
          <div className="space-y-4">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }} 
              className="flex items-center gap-3 cursor-pointer inline-flex group"
              aria-label="Green Gardan - Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-[#d8f3dc]">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-sans text-white tracking-tight">
                Green<span className="text-[#52b788]">Gardan</span>
              </span>
            </a>
            
            <p className="text-sm text-[#c5dac8] leading-relaxed max-w-sm font-normal">
              Practical British gardening wisdom, seasonal guides, and peat-free advice. Built for UK gardeners. Free forever.
            </p>

            <div className="pt-2">
              <button 
                onClick={() => navigate('/contact-us')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#2d6a4f] hover:border-[#52b788] bg-[#16382b] hover:bg-[#1b4332] text-[#c5dac8] hover:text-white text-xs font-medium transition-all cursor-pointer"
                aria-label="Contact Editorial Team"
                title="Contact Editorial Desk"
              >
                <Mail className="w-4 h-4 text-[#52b788]" />
                <span>Contact Editorial Desk</span>
              </button>
            </div>
          </div>

          {/* Topics Column (Matching Main Menu exactly) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              TOPICS
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate(`/${cat.slug}`)}
                    className="text-[#c5dac8] hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Seasonal & Popular Guides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              POPULAR GUIDES
            </h3>
            <ul className="space-y-2.5 text-sm text-[#c5dac8]">
              <li>
                <button onClick={() => navigate('/gardening-tips')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Spring Gardening Checklist · <span className="text-[#8fb494] text-xs">Gardening Tips</span></span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/flowers-plants')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Perennials for Beginners · <span className="text-[#8fb494] text-xs">Flowers</span></span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/indoor-gardening')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Low-Light Houseplants · <span className="text-[#8fb494] text-xs">Indoor Gardening</span></span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/garden-design')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Small Garden Design Ideas · <span className="text-[#8fb494] text-xs">Garden Design</span></span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wildlife-sustainable-gardening')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Building a Wildlife Pond · <span className="text-[#8fb494] text-xs">Wildlife &amp; Nature</span></span>
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              TRUST &amp; POLICIES
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/about')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>About Us &amp; Team</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/editorial-policy')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Editorial &amp; Fact-Checking Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/advertising-disclosure')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Advertising &amp; Affiliate Disclosure</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact-us')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Contact Editorial Desk</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy.html')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Privacy Policy &amp; Ezoic Disclosure</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Gardening Disclaimer</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/sitemap.xml')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>XML Sitemap (Google Index)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/robots.txt')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#52b788] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  <span>Robots.txt</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching Screenshot 3 */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-xs text-[#8fb494]">
          <p>© 2026 Green Gardan · Made with ❤️ for UK Gardeners 🇬🇧 · All guides are free, forever.</p>
          
          {/* Badges in Screenshot 3 */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4332] border border-[#2d6a4f] text-[11px] font-semibold text-[#d8f3dc]">
              <Lock className="w-3 h-3 text-[#52b788]" />
              <span>100% Peat-Free</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4332] border border-[#2d6a4f] text-[11px] font-semibold text-[#d8f3dc]">
              <Shield className="w-3 h-3 text-[#52b788]" />
              <span>100% Independent</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4332] border border-[#2d6a4f] text-[11px] font-semibold text-[#d8f3dc]">
              <Infinity className="w-3 h-3 text-[#52b788]" />
              <span>Free Forever</span>
            </span>

            <button
              onClick={scrollToTop}
              className="ml-2 p-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white transition-colors flex items-center gap-1 cursor-pointer border border-[#2d6a4f]"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

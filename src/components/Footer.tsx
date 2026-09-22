import React from 'react';
import { Sprout, Heart, Shield, ExternalLink, ArrowUp } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#23533e]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }} 
              className="flex items-center gap-3 cursor-pointer inline-flex group"
              aria-label="Green Garden - Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-[#d8f3dc]">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-editorial text-white tracking-tight">
                {siteSettings.siteName}
              </span>
            </a>
            
            <p className="text-sm text-[#c5dac8] leading-relaxed max-w-sm">
              {siteSettings.siteDescription}
            </p>
            
            <div className="pt-2 text-xs text-[#a3c4a8] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#52b788]" />
              <span>Independent UK Horticultural Publication</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              Gardening Topics
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate(`/${cat.slug}`)}
                    className="text-[#c5dac8] hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              About &amp; Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/about-us')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact-us')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="text-[#c5dac8] hover:text-white transition-colors cursor-pointer">
                  Gardening Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Technical & Compliance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#74c69d] mb-4 font-sans">
              Search &amp; Standards
            </h3>
            <ul className="space-y-2.5 text-sm text-[#c5dac8]">
              <li>
                <button onClick={() => navigate('/sitemap.xml')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs">
                  <span>/sitemap.xml</span>
                  <ExternalLink className="w-3 h-3 text-[#74c69d]" />
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/robots.txt')} className="hover:text-white transition-colors cursor-pointer font-mono text-xs">
                  /robots.txt
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ads.txt')} className="hover:text-white transition-colors cursor-pointer font-mono text-xs">
                  /ads.txt
                </button>
              </li>
              <li className="pt-2">
                <span className="inline-block bg-[#1b4332] text-[#d8f3dc] border border-[#2d6a4f] text-[11px] px-2.5 py-1 rounded-md">
                  UK Horticultural Standard
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8fb494]">
          <p>{siteSettings.footerText}</p>
          <div className="flex items-center gap-6">
            <span>Built with care for UK gardeners</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#1b4332] hover:bg-[#2d6a4f] text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

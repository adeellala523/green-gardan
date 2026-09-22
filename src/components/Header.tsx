import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck, 
  FileText, 
  Mail, 
  BookOpen, 
  Info, 
  AlertCircle
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, openSearch }) => {
  const { siteSettings, categories, isAdminLoggedIn } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setMobileAboutOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gardening Tips', path: '/gardening-tips' },
    { name: 'Flowers & Plants', path: '/flowers-plants' },
    { name: 'Indoor Gardening', path: '/indoor-gardening' },
    { name: 'Garden Design', path: '/garden-design' },
    { name: 'Wildlife & Sustainable', path: '/wildlife-sustainable-gardening' },
  ];

  const aboutLinks = [
    { name: 'About Us', path: '/about-us', icon: Info },
    { name: 'Contact Us', path: '/contact-us', icon: Mail },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
    { name: 'Terms & Conditions', path: '/terms-and-conditions', icon: FileText },
    { name: 'Cookie Policy', path: '/cookie-policy', icon: BookOpen },
    { name: 'Disclaimer', path: '/disclaimer', icon: AlertCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fcfdfa]/95 backdrop-blur-md border-b border-[#e5ebe4] transition-all">
      {/* Top Editorial Bar */}
      <div className="bg-[#1b4332] text-[#e7f2e8] text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide font-sans">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#52b788]"></span>
            <span>UK Gardening &amp; Lifestyle Publication</span>
            <span className="text-[#a7d3ab]">|</span>
            <span className="text-[#cde4ce]">Practical Advice for British Climates &amp; Soils</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => handleNavClick('/sitemap.xml')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              XML Sitemap (/sitemap.xml)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1b4332] flex items-center justify-center text-[#d8f3dc] shadow-sm group-hover:bg-[#2d6a4f] transition-all">
              <Sprout className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold font-editorial text-[#1b4332] tracking-tight block leading-none">
                {siteSettings.siteName}
              </span>
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#52796f] font-semibold block mt-1">
                UK Gardening &amp; Nature
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-[#1b4332] bg-[#e7f2e8] font-semibold' 
                      : 'text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#f1f6f1]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                onMouseEnter={() => setAboutDropdownOpen(true)}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  aboutLinks.some(l => l.path === currentPath)
                    ? 'text-[#1b4332] bg-[#e7f2e8] font-semibold'
                    : 'text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#f1f6f1]'
                }`}
                id="about-dropdown-btn"
                aria-expanded={aboutDropdownOpen}
              >
                <span>About</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {aboutDropdownOpen && (
                <div 
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                  className="absolute right-0 mt-1 w-56 rounded-xl bg-white shadow-xl border border-[#e5ebe4] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-100">
                    Publication &amp; Trust
                  </div>
                  {aboutLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full text-left px-3 py-2 text-sm text-[#2b3a30] hover:bg-[#f4f8f4] hover:text-[#1b4332] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-[#52796f]" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons: Search & Admin */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2.5 rounded-full text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#edf4ed] transition-colors cursor-pointer"
              title="Search articles"
              aria-label="Search articles"
              id="search-open-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#edf4ed] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcfdfa] border-b border-[#e5ebe4] px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#1b4332] text-white font-semibold' 
                      : 'text-[#2b3a30] hover:bg-[#edf4ed]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}

            {/* Mobile About Accordion */}
            <div className="pt-2">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-base font-medium text-[#2b3a30] hover:bg-[#edf4ed]"
              >
                <span>About Green Garden</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileAboutOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-[#f4f8f4] rounded-lg mt-1">
                  {aboutLinks.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className="w-full text-left px-3 py-2 text-sm text-[#2b3a30] hover:text-[#1b4332] flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4 text-[#52796f]" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e5ebe4] flex justify-between items-center text-xs text-neutral-500">
              <button 
                onClick={() => handleNavClick('/sitemap.xml')}
                className="font-medium text-[#1b4332] hover:underline"
              >
                XML Sitemap (/sitemap.xml)
              </button>
              <button 
                onClick={() => handleNavClick('/contact-us')}
                className="hover:underline text-neutral-600"
              >
                Contact Editorial Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

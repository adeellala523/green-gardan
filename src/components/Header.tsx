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
  AlertCircle,
  Flower2,
  Leaf,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, openSearch }) => {
  const { siteSettings, categories } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Gardening Tips', path: '/gardening-tips', icon: Sprout },
    { name: 'Flowers & Plants', path: '/flowers-plants', icon: Flower2 },
    { name: 'Indoor Gardening', path: '/indoor-gardening', icon: Leaf },
    { name: 'Garden Design', path: '/garden-design', icon: Compass },
    { name: 'Wildlife & Nature', path: '/wildlife-sustainable-gardening', icon: HeartHandshake },
  ];

  const aboutLinks = [
    { name: 'About Us', path: '/about-us', icon: Info },
    { name: 'Contact Us', path: '/contact-us', icon: Mail },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
    { name: 'Terms of Service', path: '/terms-and-conditions', icon: FileText },
    { name: 'Cookie Policy', path: '/cookie-policy', icon: BookOpen },
    { name: 'Disclaimer', path: '/disclaimer', icon: AlertCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5ece4] transition-all">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo in OmniTools style */}
          <a 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
            aria-label="Green Gardan - Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] flex items-center justify-center text-[#d8f3dc] shadow-sm group-hover:bg-[#2d6a4f] transition-all">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold font-sans tracking-tight text-[#14281c]">
              Green<span className="text-[#2d6a4f]">Gardan</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'text-[#1b4332] bg-[#e7f2e8]' 
                  : 'text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#f1f6f1]'
              }`}
            >
              Home
            </button>

            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-[#1b4332] bg-[#e7f2e8]' 
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
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  aboutLinks.some(l => l.path === currentPath)
                    ? 'text-[#1b4332] bg-[#e7f2e8]'
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
                  className="absolute right-0 mt-1 w-56 rounded-2xl bg-white shadow-xl border border-[#e5ebe4] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-neutral-400 font-bold border-b border-neutral-100">
                    Publication &amp; Trust
                  </div>
                  {aboutLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full text-left px-3.5 py-2 text-sm font-medium text-[#2b3a30] hover:bg-[#f4f8f4] hover:text-[#1b4332] flex items-center gap-2.5 transition-colors cursor-pointer"
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

          {/* Action Buttons: Search & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2.5 rounded-xl text-[#2b3a30] hover:text-[#1b4332] hover:bg-[#edf4ed] border border-transparent hover:border-[#d6e3d7] transition-all cursor-pointer"
              title="Search articles"
              aria-label="Search articles"
              id="search-open-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button in OmniTools rounded-xl border style */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-[#d6e3d7] bg-white text-[#1b4332] hover:bg-[#f1f6f1] transition-all cursor-pointer shadow-2xs"
              aria-label="Toggle navigation menu"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Exactly like OmniTools Screenshot 2) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e5ebe4] px-5 py-6 space-y-3 animate-in fade-in duration-200 shadow-xl">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#1b4332] text-white shadow-xs' 
                      : 'text-[#14281c] hover:bg-[#f4f8f4]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#2d6a4f]'}`} />
                  <span>{link.name}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#edf2ee] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-4 block mb-2">
                About &amp; Policies
              </span>
              {aboutLinks.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#385141] hover:bg-[#f4f8f4] cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#52796f]" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { PageType, UserProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  user: UserProfileData;
  onSearch?: (query: string) => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onSearch,
  isLoggedIn,
  onToggleLogin
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuDrawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-close mobile menu and dropdown when route/currentPage changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [currentPage]);

  // Auto-close 3-line menu and user dropdown when user clicks or touches anywhere outside
  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Close 3-line mobile menu if click/touch is outside menu drawer and hamburger toggle button
      if (
        mobileMenuOpen &&
        menuDrawerRef.current &&
        !menuDrawerRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }

      // Close user avatar dropdown if click/touch is outside dropdown container
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (mobileMenuOpen || userDropdownOpen) {
      document.addEventListener('pointerdown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [mobileMenuOpen, userDropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (onSearch) {
      onSearch(searchVal);
      onNavigate('find-jobs');
    }
  };

  const navLinks: { label: string; page: PageType }[] = [
    { label: t('home'), page: 'home' },
    { label: t('findJobs'), page: 'find-jobs' },
    { label: t('about'), page: 'about' },
    { label: t('contact'), page: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Brand Logo & Links */}
        <div className="flex items-center gap-2 lg:gap-8 min-w-0">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
              setUserDropdownOpen(false);
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">bolt</span>
            </div>
            <div className="text-left">
              <span className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center font-display">
                Micro<span className="text-blue-600">Jobs</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 transition-colors cursor-pointer text-sm font-semibold rounded-lg ${
                    isActive
                      ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-blue-600'
                      : 'hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {/* Quick Admin Navigation Link */}
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
                setUserDropdownOpen(false);
              }}
              className={`px-3 py-1.5 ml-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
              <span>{t('adminConsole')}</span>
            </button>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Compact Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-36 lg:w-48 xl:w-56">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            <span className="material-symbols-outlined w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
              search
            </span>
          </form>

          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 relative" ref={userDropdownRef}>
              {/* User Profile Avatar Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer group focus:outline-none"
                >
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center ring-2 ring-blue-500/20 shadow-xs flex-shrink-0">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:flex flex-col text-left pr-1">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 leading-none transition-colors">
                      {user.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium">
                      {t('topRatedFreelancer')}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    expand_more
                  </span>
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      <span>{t('myProfile')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      <span>{t('adminControlCenter')}</span>
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        onToggleLogin();
                        setUserDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>{t('logOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 transition-colors cursor-pointer"
              >
                {t('login')}
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-sm shadow-blue-500/30 transition-all hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Three-line Hamburger Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setUserDropdownOpen(false);
            }}
            className="p-1.5 sm:p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl focus:outline-none cursor-pointer flex-shrink-0 transition-colors border border-slate-200/80"
            aria-label="Toggle menu"
            title="Menu & Language Option"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[26px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Three-line Menu Drawer (Contains Language Switcher & Navigation Links) */}
      {mobileMenuOpen && (
        <div
          ref={menuDrawerRef}
          className="bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150 max-w-7xl mx-auto z-50 relative"
        >
          {/* Search Bar inside Menu */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:hidden">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
            <span className="material-symbols-outlined w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
              search
            </span>
          </form>

          {/* Language Switcher Option Inside Three-line Menu */}
          <div className="py-2.5 px-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">translate</span>
              <span className="text-xs font-bold text-slate-800">
                {language === 'en' ? 'Language / ওয়েবসাইট ভাষা:' : 'ভাষা / Language:'}
              </span>
            </div>
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>{language === 'en' ? 'বাংলা রূপান্তর করুন' : 'Switch to English'}</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                  currentPage === link.page
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
              </button>
            ))}

            {/* Account & Profile Options in 3-Line Menu for Mobile */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                  currentPage === 'profile'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">account_circle</span>
                  <span>{t('myProfile')}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
              </button>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer text-center"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer text-center shadow-xs"
                >
                  {t('register')}
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 transition-colors flex items-center justify-between cursor-pointer mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>{t('adminConsole')}</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-blue-600">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Non-blocking Mobile Backdrop Overlay for Click-Outside Auto Close */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-slate-900/20 backdrop-blur-2xs z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

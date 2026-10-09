import React, { useState } from 'react';
import { CategoryItem, PageType, Job } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FindJobsPageProps {
  categories: CategoryItem[];
  jobs?: Job[];
  onNavigate?: (page: PageType) => void;
  onSelectCategory?: (category: CategoryItem) => void;
  onSelectJob?: (job: Job) => void;
}

export const FindJobsPage: React.FC<FindJobsPageProps> = ({
  categories,
  onNavigate,
  onSelectCategory
}) => {
  const { t } = useLanguage();
  const [searchVal, setSearchVal] = useState('');

  // Brand icons for category cards matching Home page design
  const renderCategoryIcon = (catName: string) => {
    if (catName.includes('Gmail')) {
      return (
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
      );
    }
    if (catName.includes('Instagram')) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      );
    }
    if (catName.includes('কোরআন') || catName.toLowerCase().includes('quran')) {
      return (
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[26px]">menu_book</span>
        </div>
      );
    }
    if (catName.includes('নামাজ') || catName.toLowerCase().includes('namaz') || catName.toLowerCase().includes('namaj') || catName.toLowerCase().includes('prayer')) {
      return (
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[26px]">mosque</span>
        </div>
      );
    }
    if (catName.includes('Telegram')) {
      return (
        <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.832.941z"/>
          </svg>
        </div>
      );
    }
    if (catName.includes('Mobile Recharge') || catName.includes('Recharge')) {
      return (
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[26px]">phonelink_ring</span>
        </div>
      );
    }
    if (catName.includes('Target Bonus') || catName.includes('Target')) {
      return (
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[26px]">stars</span>
        </div>
      );
    }
    if (catName.includes('Leader Shift') || catName.includes('Leader')) {
      return (
        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[26px]">leaderboard</span>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
        <span className="material-symbols-outlined text-[26px]">work</span>
      </div>
    );
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchVal.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-slate-50/50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HERO & SEARCH HEADER */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[15px]">category</span>
            <span>Popular Marketplace Categories • High Reward Rates</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            {t('popularCategories')}
          </h1>

          <p className="text-slate-600 text-xs sm:text-base mt-2 max-w-xl leading-relaxed">
            {t('popularCategoriesSub')}
          </p>

          {/* Search Category Bar */}
          <div className="w-full mt-6 flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl sm:rounded-full shadow-md border border-slate-100">
            <div className="relative flex-1 flex items-center pl-4">
              <span className="material-symbols-outlined text-slate-400 text-[22px] select-none">
                search
              </span>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search categories (e.g. Gmail, Quran, Instagram, Recharge)..."
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-7 py-3 rounded-full transition-all shadow-sm cursor-pointer"
            >
              <span>Search</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* POPULAR CATEGORIES GRID */}
        <div className="w-full">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (cat.name.includes('Gmail')) {
                      if (onNavigate) onNavigate('gmail-sell');
                    } else if (cat.name.includes('Instagram')) {
                      if (onNavigate) onNavigate('instagram-sell');
                    } else if (cat.name.includes('Telegram')) {
                      if (onNavigate) onNavigate('telegram-sell');
                    } else if (
                      cat.id === 'cat-quran' ||
                      cat.name.toLowerCase().includes('quran') ||
                      cat.name.includes('কোরআন') ||
                      (cat.description && cat.description.toLowerCase().includes('quran'))
                    ) {
                      if (onNavigate) onNavigate('quran');
                    } else if (
                      cat.id === 'cat-namaz' ||
                      cat.name.toLowerCase().includes('namaj') ||
                      cat.name.toLowerCase().includes('namaz') ||
                      cat.name.includes('নামাজ') ||
                      (cat.description && (cat.description.toLowerCase().includes('prayer') || cat.description.toLowerCase().includes('namaz') || cat.description.toLowerCase().includes('namaj')))
                    ) {
                      if (onNavigate) onNavigate('namaj');
                    } else if (onSelectCategory) {
                      onSelectCategory(cat);
                    }
                  }}
                  className="p-6 rounded-2xl bg-white hover:bg-blue-50/40 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform">
                    {renderCategoryIcon(cat.name)}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#1E62EC] transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {cat.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E62EC]">{cat.rewardRange}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      cat.id === 'cat-quran'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : cat.id === 'cat-namaz' || cat.name.toLowerCase().includes('namaj') || cat.name.toLowerCase().includes('namaz')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {cat.id === 'cat-quran'
                        ? 'টাইমার রিওয়ার্ড'
                        : cat.id === 'cat-namaz' || cat.name.toLowerCase().includes('namaj') || cat.name.toLowerCase().includes('namaz')
                        ? 'নামাজের সময়সূচী'
                        : 'Active Tasks'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-1">No Categories Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try searching for another keyword or clear search to view all popular categories.
              </p>
              <button
                onClick={() => setSearchVal('')}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-full shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

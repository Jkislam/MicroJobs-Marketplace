import React, { useState } from 'react';
import { Job, CategoryItem, PageType, CompletedJobActivity } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  jobs: Job[];
  categories: CategoryItem[];
  completedActivities?: CompletedJobActivity[];
  onNavigate: (page: PageType) => void;
  onSelectJob: (job: Job) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  jobs,
  categories,
  completedActivities = [],
  onNavigate,
  onSelectJob
}) => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: t('faqQ1'),
      a: t('faqA1')
    },
    {
      q: t('faqQ2'),
      a: t('faqA2')
    },
    {
      q: t('faqQ3'),
      a: t('faqA3')
    },
    {
      q: t('faqQ4'),
      a: t('faqA4')
    },
    {
      q: t('faqQ5'),
      a: t('faqA5')
    },
    {
      q: t('faqQ6'),
      a: t('faqA6')
    }
  ];

  // Helper to get brand icons for category cards matching screenshot
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
    if (catName.includes('YouTube')) {
      return (
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
      );
    }
    if (catName.includes('Social')) {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
        <span className="material-symbols-outlined text-[26px]">language</span>
      </div>
    );
  };

  // Helper for Job card icon badge matching UI screenshot
  const renderJobCardIcon = (title: string, _category: string) => {
    if (title.toLowerCase().includes('gmail')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
      );
    }
    if (title.toLowerCase().includes('instagram')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      );
    }
    if (title.toLowerCase().includes('telegram')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.832.941z"/>
          </svg>
        </div>
      );
    }
    if (title.toLowerCase().includes('youtube')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
      );
    }
    if (title.toLowerCase().includes('facebook')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      );
    }
    if (title.toLowerCase().includes('website')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">language</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <span className="material-symbols-outlined text-[22px]">work</span>
      </div>
    );
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Email': return 'bg-red-50 text-red-600';
      case 'Social Media': return 'bg-blue-50 text-blue-600';
      case 'Telegram': return 'bg-sky-50 text-sky-600';
      case 'YouTube': return 'bg-rose-50 text-rose-600';
      case 'Website': return 'bg-indigo-50 text-indigo-600';
      case 'Data Entry': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="w-full bg-[#FAFCFF]">
      {/* HERO SECTION WITH RESPONSIVE BACKGROUND IMAGE */}
      <section 
        className="relative bg-[#EBF3FF] pt-10 pb-16 sm:pt-16 sm:pb-20 lg:py-24 overflow-hidden border-b border-blue-100/60 w-full min-h-[380px] sm:min-h-[460px] flex items-center"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/image/hero.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center sm:object-right opacity-85 sm:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Readability Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EBF3FF]/90 via-[#EBF3FF]/75 to-[#EBF3FF]/40 sm:bg-gradient-to-r sm:from-[#EBF3FF] sm:via-[#EBF3FF]/85 sm:to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left max-w-full">
              {/* Soft Blue Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#DCE7FF]/90 backdrop-blur-xs text-[#1E62EC] text-[11px] sm:text-xs font-bold shadow-2xs max-w-full">
                <span className="material-symbols-outlined text-[15px] sm:text-[16px]">bolt</span>
                <span className="truncate">{t('heroBadge')}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-[1.12] break-words max-w-full font-display">
                {t('heroTitle1')}{' '}
                <span className="text-[#1E62EC] block mt-1">{t('heroTitle2')}</span>
              </h1>

              {/* Paragraph */}
              <p className="text-sm sm:text-lg text-slate-600 max-w-lg font-normal leading-relaxed break-words">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1E62EC] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('exploreMarketplace')}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/95 hover:bg-blue-50 text-[#1E62EC] border border-[#1E62EC]/50 font-bold text-sm shadow-2xs transition-all cursor-pointer backdrop-blur-xs text-center justify-center flex items-center"
                >
                  {t('startEarning')}
                </button>
              </div>
            </div>

            {/* Hero Right Column: Clean & Empty */}
            <div className="hidden lg:block lg:col-span-6 min-h-[300px]"></div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{t('popularCategories')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('popularCategoriesSub')}</p>
            </div>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="text-xs font-bold text-[#1E62EC] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{t('viewAllCategories')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.name.includes('Gmail')) {
                    onNavigate('gmail-sell');
                  } else if (cat.name.includes('Instagram')) {
                    onNavigate('instagram-sell');
                  } else if (cat.name.includes('Telegram')) {
                    onNavigate('telegram-sell');
                  } else if (
                    cat.id === 'cat-quran' ||
                    cat.name.toLowerCase().includes('quran') ||
                    cat.name.includes('কোরআন') ||
                    (cat.description && cat.description.toLowerCase().includes('quran'))
                  ) {
                    onNavigate('quran');
                  } else if (
                    cat.id === 'cat-namaz' ||
                    cat.name.toLowerCase().includes('namaj') ||
                    cat.name.toLowerCase().includes('namaz') ||
                    cat.name.includes('নামাজ') ||
                    (cat.description && (cat.description.toLowerCase().includes('prayer') || cat.description.toLowerCase().includes('namaz') || cat.description.toLowerCase().includes('namaj')))
                  ) {
                    onNavigate('namaj');
                  } else {
                    onNavigate('find-jobs');
                  }
                }}
                className="p-6 rounded-2xl bg-white hover:bg-blue-50/40 border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {renderCategoryIcon(cat.name)}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#1E62EC] transition-colors mb-1">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-1">
                    {cat.description}
                  </p>
                )}
                {cat.jobsCount ? (
                  <span className="text-xs text-[#1E62EC] font-semibold">{cat.jobsCount}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLETE JOBS SECTION */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Feed • Auto Update</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{t('featuredJobs')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('featuredJobsSub')}</p>
            </div>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="text-xs font-bold text-[#1E62EC] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>{t('viewAllJobs')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* LIVE COMPLETED JOBS LIST */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">verified</span>
                <span className="font-extrabold text-sm tracking-wide">
                  {t('recentCompletedTitle')}
                </span>
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {completedActivities.length} {t('totalCompletedCount')}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {completedActivities.map((act, index) => (
                <div
                  key={act.id}
                  className={`p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                    index === 0 ? 'bg-emerald-50/40 border-l-4 border-l-emerald-500' : ''
                  }`}
                >
                  {/* User Name & Avatar */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{act.userName}</span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                            Live
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">{act.completedAt}</span>
                    </div>
                  </div>

                  {/* Completed Job Title & Category */}
                  <div className="flex-1 sm:px-4">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{act.jobTitle}</p>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100">
                      {act.category}
                    </span>
                  </div>

                  {/* Earned Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-[140px] pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-medium block">
                        {t('earnedAmountLabel')}
                      </span>
                      <span className="text-base font-extrabold text-emerald-600 font-numeric-stat">
                        +${act.earnedAmount.toFixed(2)}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 text-[22px]">
                      check_circle
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{t('howItWorksTitle')}</h2>
          <p className="text-sm text-slate-500 mt-1 mb-12">{t('howItWorksSub')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1E62EC] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-[30px]">search</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{t('step1Title')}</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="hidden md:block absolute left-[31%] top-8 text-[#1E62EC] font-bold text-xl">
              ➔
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1E62EC] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-[30px]">assignment_turned_in</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{t('step2Title')}</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="hidden md:block absolute right-[31%] top-8 text-[#1E62EC] font-bold text-xl">
              ➔
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1E62EC] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-[30px]">attach_money</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{t('step3Title')}</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0B215E] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-6 max-w-md">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[40px]">home_work</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{t('bannerTitle')}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
                  {t('bannerSubtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('find-jobs')}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0B215E] font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0"
            >
              <span>{t('startEarning')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{t('faqTitle')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('faqSub')}</p>
            </div>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="text-xs font-bold text-[#1E62EC] hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{t('viewAllJobs')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-4 font-bold text-slate-800 text-sm flex items-center justify-between hover:bg-slate-100/60 cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 py-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

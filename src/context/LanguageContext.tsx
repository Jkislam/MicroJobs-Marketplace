import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  // Navigation Links
  home: { en: 'Home', bn: 'হোম' },
  findJobs: { en: 'Find Jobs', bn: 'কাজ খুঁজুন' },
  about: { en: 'About', bn: 'আমাদের সম্পর্কে' },
  contact: { en: 'Contact', bn: 'যোগাযোগ' },
  adminConsole: { en: 'Admin Console', bn: 'এডমিন কনসোল' },
  searchPlaceholder: { en: 'Search jobs...', bn: 'কাজ খুঁজুন...' },
  login: { en: 'Login', bn: 'লগইন' },
  register: { en: 'Register', bn: 'রেজিস্টার' },
  myProfile: { en: 'My Profile', bn: 'আমার প্রোফাইল' },
  adminControlCenter: { en: 'Admin Control Center', bn: 'এডমিন কন্ট্রোল সেন্টার' },
  logOut: { en: 'Log Out', bn: 'লগ আউট' },
  topRatedFreelancer: { en: 'Top Rated Freelancer', bn: 'টপ রেটেড ফ্রিল্যান্সার' },
  langName: { en: 'বাংলা', bn: 'English' },

  // Hero Section
  heroBadge: { en: 'Work • Earn • Grow', bn: 'কাজ করুন • আয় করুন • বৃদ্ধি পান' },
  heroTitle1: { en: 'Buy Digital Products.', bn: 'ডিজিটাল প্রোডাক্ট কিনুন।' },
  heroTitle2: { en: 'Start Earning Online.', bn: 'অনলাইনে আয় শুরু করুন।' },
  heroSubtitle: { 
    en: 'Discover useful digital products and sell your own legal digital products through our simple marketplace.', 
    bn: 'আমাদের সহজ মার্কেটপ্লেসের মাধ্যমে প্রয়োজনীয় ডিজিটাল সার্ভিস খুঁজুন এবং ঘরে বসে কাজ করে সহজে আয় করুন।' 
  },
  exploreMarketplace: { en: 'Explore Marketplace', bn: 'মার্কেটপ্লেস খুঁজুন' },
  startEarning: { en: 'Start Earning', bn: 'আয় শুরু করুন' },

  // Homepage Sections
  popularCategories: { en: 'Popular Categories', bn: 'জনপ্রিয় ক্যাটাগরি' },
  popularCategoriesSub: { en: 'Explore a wide range of digital products and services.', bn: 'বিভিন্ন ধরণের ডিজিটাল কাজ ও সার্ভিস ব্রাউজ করুন।' },
  viewAllCategories: { en: 'View All Categories', bn: 'সকল ক্যাটাগরি দেখুন' },
  featuredJobs: { en: 'Complete Jobs', bn: 'কমপ্লিট জবস (সম্পন্নকৃত কাজ)' },
  featuredJobsSub: { en: 'Live updates of users who completed tasks and earned money instantly.', bn: 'ইউজারদের লাইভ সম্পন্নকৃত কাজ এবং তাদের মোট অর্জিত আয়ের তালিকা।' },
  viewAllJobs: { en: 'View All Jobs', bn: 'সকল কাজ দেখুন' },
  viewDetails: { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  slotsLeft: { en: 'slots left', bn: 'টি খালি আছে' },
  reward: { en: 'Reward', bn: 'পুরস্কার / আয়' },
  recentCompletedTitle: { en: 'Live Completed Tasks & Earnings', bn: 'লাইভ সম্পন্নকৃত কাজ ও আয়ের তালিকা' },
  totalCompletedCount: { en: 'tasks completed', bn: 'টি কাজ সম্পন্ন হয়েছে' },
  earnedAmountLabel: { en: 'Total Earned', bn: 'মোট ইনকাম' },

  // How It Works
  howItWorksTitle: { en: 'How It Works', bn: 'কিভাবে কাজ করবেন' },
  howItWorksSub: { en: 'Earn money online in 3 simple steps', bn: 'সহজ ৩টি ধাপে অনলাইন থেকে কাজ করে আয় করুন' },
  step1Title: { en: 'Select a Job', bn: '১. কাজ নির্বাচন করুন' },
  step1Desc: { 
    en: 'Browse through hundreds of verified micro-jobs across categories like Email, Social Media, YouTube, and Data Entry.', 
    bn: 'ইমেইল, সোশ্যাল মিডিয়া, ইউটিউব এবং ডাটা এন্ট্রির মতো ক্যাটাগরি থেকে আপনার পছন্দের কাজ বেছে নিন।' 
  },
  step2Title: { en: 'Complete Task & Submit Proof', bn: '২. কাজ সম্পন্ন করে প্রুফ দিন' },
  step2Desc: { 
    en: 'Follow simple instructions step-by-step and submit required screenshots or confirmation links.', 
    bn: 'সহজ নির্দেশনাবলী অনুসরণ করে কাজ শেষ করুন এবং স্ক্রিনশট বা প্রুফ দিন।' 
  },
  step3Title: { en: 'Get Paid Instantly', bn: '৩. সাথে সাথেই পেমেন্ট গ্রহণ করুন' },
  step3Desc: { 
    en: 'Once verified, your earnings are credited directly to your escrow wallet and cashout via bKash, Nagad or Bank.', 
    bn: 'আপনার প্রুফ যাচাই হলেই টাকা আপনার ওয়ালেটে জমা হবে এবং বিকাশ, নগদ বা ব্যাংকে উইথড্র করতে পারবেন।' 
  },

  // Banner & FAQ
  bannerTitle: { en: 'Earn Money From Home Effortlessly', bn: 'ঘরে বসে সহজেই অনলাইন থেকে আয় করুন' },
  bannerSubtitle: { 
    en: 'Join thousands of active workers earning daily through verified simple digital tasks.', 
    bn: 'হাজার হাজার এক্টিভ ফ্রিল্যান্সারদের সাথে যোগ দিন এবং প্রতিদিন সহজ কাজ করে আয় নিশ্চিত করুন।' 
  },
  faqTitle: { en: 'Frequently Asked Questions', bn: 'সাধারণ প্রশ্নাবলী' },
  faqSub: { en: 'Got questions? We have answers for everything you need to know.', bn: 'আপনার কোনো প্রশ্ন থাকলে উত্তরগুলো এখান থেকে জেনে নিন।' },

  // Find Jobs Page
  findJobsTitle: { en: 'Explore Available Micro-Jobs', bn: 'উপলব্ধ কাজসমূহ খুঁজুন' },
  findJobsSub: { 
    en: 'Complete simple digital tasks and get paid directly to your mobile wallet.', 
    bn: 'সহজ কাজগুলো সম্পন্ন করে সরাসরি আপনার মোবাইল ওয়ালেটে টাকা গ্রহণ করুন।' 
  },
  searchJobsInput: { en: 'Search job title or keyword...', bn: 'কাজের শিরোনাম বা কিওয়ার্ড লিখুন...' },
  allCategories: { en: 'All Categories', bn: 'সকল ক্যাটাগরি' },
  filters: { en: 'Filters', bn: 'ফিল্টারসমূহ' },
  clearAll: { en: 'Clear All', bn: 'রিসেট করুন' },
  categoriesHeader: { en: 'Categories', bn: 'ক্যাটাগরিসমূহ' },
  rewardRange: { en: 'Reward Range', bn: 'আয়ের পরিমাণ' },
  min: { en: 'Min ($)', bn: 'সর্বনিম্ন ($)' },
  max: { en: 'Max ($)', bn: 'সর্বোচ্চ ($)' },
  availableJobs: { en: 'Jobs Available', bn: 'টি কাজ পাওয়া গেছে' },
  sortBy: { en: 'Sort by:', bn: 'সাজান:' },
  newestFirst: { en: 'Newest First', bn: 'সর্বশেষ প্রকাশিত' },
  highestReward: { en: 'Highest Reward', bn: 'সর্বোচ্চ আয়' },
  mostSlots: { en: 'Most Slots Available', bn: 'বেশি খালি স্থান' },
  topRatedClients: { en: 'Top Rated Clients', bn: 'টপ রেটেড ক্লায়েন্ট' },
  noJobsFound: { en: 'No jobs found matching your criteria.', bn: 'আপনার ফিল্টারের সাথে মিলে এমন কোনো কাজ পাওয়া যায়নি।' },

  // Job Modal
  taskInstructions: { en: 'Task Instructions', bn: 'কাজের নির্দেশনাবলী' },
  requirements: { en: 'Requirements', bn: 'প্রয়োজনীয় জিনিসপত্র' },
  submitProofTitle: { en: 'Submit Task Proof', bn: 'কাজের প্রমাণপত্র (Proof) জমা দিন' },
  proofPlaceholder: { 
    en: 'Enter your proof details, transaction IDs, or screenshot link here...', 
    bn: 'আপনার কাজের বিবরণ, ইউজারনেম বা প্রুফ লিংক এখানে লিখুন...' 
  },
  submitProofBtn: { en: 'Submit Proof & Claim Reward', bn: 'প্রুফ জমা দিন এবং আয় গ্রহণ করুন' },
  clientInfo: { en: 'Client Information', bn: 'ক্লায়েন্টের তথ্য' },
  verifiedBuyer: { en: 'Verified Buyer', bn: 'যাচাইকৃত ক্লায়েন্ট' },
  daysLeft: { en: 'Days left', bn: 'দিন বাকি' },

  // Footer
  categories: { en: 'Categories', bn: 'ক্যাটাগরি' },
  terms: { en: 'Terms', bn: 'শর্তাবলী' },
  privacy: { en: 'Privacy', bn: 'গোপনীয়তা নীতি' },
  copyright: { 
    en: '© 2026 MicroJobs Inc. All rights reserved. Built with precision and care.', 
    bn: '© ২০২৬ MicroJobs Inc. সর্বস্বত্ব সংরক্ষিত।' 
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key].en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

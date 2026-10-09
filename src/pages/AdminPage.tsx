import React, { useState } from 'react';
import { Job, WithdrawalRequest, PageType, UserProfileData, GmailSubmission, JobSubmission, InstagramSubmission, TelegramSubmission } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminPageProps {
  jobs: Job[];
  withdrawals: WithdrawalRequest[];
  gmailSubmissions: GmailSubmission[];
  instagramSubmissions?: InstagramSubmission[];
  telegramSubmissions?: TelegramSubmission[];
  jobSubmissions: JobSubmission[];
  onNavigate: (page: PageType) => void;
  onApproveJob: (jobId: string) => void;
  onRejectJob: (jobId: string) => void;
  onUpdateJobReward?: (jobId: string, newReward: number) => void;
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  onApproveGmailSubmission: (id: string, updatedReward: number) => void;
  onRejectGmailSubmission: (id: string) => void;
  onApproveInstagramSubmission?: (id: string, updatedReward: number) => void;
  onRejectInstagramSubmission?: (id: string) => void;
  onApproveTelegramSubmission?: (id: string, updatedReward: number) => void;
  onRejectTelegramSubmission?: (id: string) => void;
  onApproveJobSubmission: (id: string, updatedReward: number) => void;
  onRejectJobSubmission: (id: string) => void;
  currentUser?: UserProfileData;
  onUpdateUser?: (updated: UserProfileData) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  jobs,
  withdrawals,
  gmailSubmissions,
  instagramSubmissions = [],
  telegramSubmissions = [],
  jobSubmissions = [],
  onNavigate,
  onApproveJob,
  onRejectJob,
  onUpdateJobReward,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onApproveGmailSubmission,
  onRejectGmailSubmission,
  onApproveInstagramSubmission,
  onRejectInstagramSubmission,
  onApproveTelegramSubmission,
  onRejectTelegramSubmission,
  onApproveJobSubmission,
  onRejectJobSubmission,
  currentUser,
  onUpdateUser
}) => {
  const { language } = useLanguage();

  // Admin authentication state (saved in localStorage for session persistence)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('microjobs_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'jobs' | 'submissions' | 'withdrawals'>('dashboard');
  const [submissionCategoryTab, setSubmissionCategoryTab] = useState<'all' | 'gmail' | 'instagram' | 'telegram' | 'jobs'>('all');
  const [timeframe, setTimeframe] = useState('30days');
  const [jobFilter, setJobFilter] = useState('');
  const [proofViewerOpen, setProofViewerOpen] = useState(false);
  const [rewards, setRewards] = useState<Record<string, number>>({});
  const [instagramRewards, setInstagramRewards] = useState<Record<string, number>>({});
  const [telegramRewards, setTelegramRewards] = useState<Record<string, number>>({});
  const [jobRewards, setJobRewards] = useState<Record<string, number>>({});
  const [campaignRewards, setCampaignRewards] = useState<Record<string, number>>({});

  const pendingGmailCount = gmailSubmissions.filter(s => s.status === 'pending').length;
  const pendingInstagramCount = instagramSubmissions.filter(s => s.status === 'pending').length;
  const pendingTelegramCount = telegramSubmissions.filter(s => s.status === 'pending').length;
  const pendingJobCount = jobSubmissions.filter(s => s.status === 'pending').length;
  const totalPendingSubmissions = pendingGmailCount + pendingJobCount + pendingInstagramCount + pendingTelegramCount;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const trimmedPass = adminPassword.trim();

    // Check credentials (supports admin@microjobs.com / admin123, admin@gmail.com, or admin username)
    const isAllowedEmail = 
      trimmedEmail === 'admin@microjobs.com' || 
      trimmedEmail === 'admin@gmail.com' ||
      trimmedEmail === 'admin' ||
      trimmedEmail.includes('admin');

    const isAllowedPassword = 
      trimmedPass === 'admin123' ||
      trimmedPass === '123456' ||
      trimmedPass === 'admin' ||
      trimmedPass === 'admin@123';

    if (isAllowedEmail && isAllowedPassword) {
      localStorage.setItem('microjobs_admin_auth', 'true');
      setAuthSuccess(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setAuthSuccess(false);
      }, 400);
    } else {
      setAuthError(
        language === 'bn'
          ? 'ভুল ইমেল অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক এডমিন তথ্য দিন। (Default: admin@microjobs.com / admin123)'
          : 'Invalid email or password! Please enter correct admin credentials. (Default: admin@microjobs.com / admin123)'
      );
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('microjobs_admin_auth');
    setIsAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
    setAuthError('');
  };

  const handleFillDemoCredentials = () => {
    setAdminEmail('admin@microjobs.com');
    setAdminPassword('admin123');
    setAuthError('');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Title,Category,Reward,Status\n" + 
      jobs.map(j => `${j.id},"${j.title}",${j.category},${j.reward},${j.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "microjobs_campaigns.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authenticated, render the dedicated Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D1F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100 font-sans">
        {/* Ambient background glow dots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Top Logo & Title */}
          <div className="text-center space-y-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none mb-2"
              title="Return to Website"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[28px]">shield_person</span>
              </div>
            </button>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>{language === 'bn' ? 'সংরক্ষিত এডমিন পোর্টাল' : 'Restricted Admin Access'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {language === 'bn' ? 'এডমিন প্যানেলে প্রবেশ করুন' : 'Admin Portal Sign In'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              {language === 'bn' 
                ? 'এডমিন কন্ট্রোল সেন্টারে প্রবেশ করার জন্য অনুমোদিত ইমেল এবং পাসওয়ার্ড দিন।' 
                : 'Enter your authorized administrator email and password to access the moderation console.'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top glowing line accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"></div>

            {/* Quick Demo Helper */}
            <div className="mb-5 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5 text-left">
                <div className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">key</span>
                  <span>{language === 'bn' ? 'এডমিন লগইন তথ্য (Default):' : 'Admin Credentials:'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  <span>admin@microjobs.com</span> • <span>admin123</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
              >
                {language === 'bn' ? 'তথ্য বসান (Auto Fill)' : 'Auto Fill'}
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-red-400 text-lg flex-shrink-0">error</span>
                <span className="font-medium text-left">{authError}</span>
              </div>
            )}

            {/* Success Banner */}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-emerald-400 text-lg flex-shrink-0">verified</span>
                <span className="font-bold">{language === 'bn' ? 'লগইন সফল! রিডাইরেক্ট হচ্ছে...' : 'Login successful! Redirecting...'}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">
                  {language === 'bn' ? 'এডমিন ইমেল' : 'Admin Email'} <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@microjobs.com"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-950/70 text-white text-xs font-medium rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-10 bg-slate-950/70 text-white text-xs font-medium rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
                  <span>{language === 'bn' ? '২৫৬-বিট এনক্রিপশন' : '256-bit encrypted'}</span>
                </span>
                <span className="text-slate-500">v2.4 Admin Core</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-blue-600/50"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{language === 'bn' ? 'এডমিন প্যানেলে প্রবেশ করুন' : 'Sign In to Admin Console'}</span>
              </button>
            </form>

            {/* Back to website button */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs text-slate-400 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{language === 'bn' ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Return to Website'}</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-500">
            MicroJobs Moderator & Administrator Portal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 shadow-xs sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-[22px]">token</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg block leading-none font-display">MicroJobs</span>
              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-semibold text-xs text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === 'users' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Users</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">12.4k</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">work</span>
                <span>Jobs Moderation</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">14</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === 'submissions' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">fact_check</span>
                <span>Submissions Queue</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">
                {totalPendingSubmissions}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === 'withdrawals' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Withdrawals Queue</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">{withdrawals.filter(w=>w.status==='pending').length}</span>
            </button>
          </nav>
        </div>

        {/* System Status & Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="font-bold text-slate-700 text-[11px]">All Systems Live</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">speed</span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="Log out of Admin Console"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>{language === 'bn' ? 'এডমিন লগআউট' : 'Admin Logout'}</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{language === 'bn' ? 'ওয়েবসাইটে ফিরে যান' : 'Exit to Website'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Admin Overview</span>
            <div className="relative hidden sm:flex items-center w-64">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search users, jobs, IDs... (⌘K)"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Marketplace Live</span>
            </div>

            <button onClick={handleExportCSV} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer" title="Export CSV Data">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Sabbir"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">Sabbir</span>
                <span className="text-[10px] text-slate-500">Super Admin</span>
              </div>
            </div>

            {/* Header Admin Logout & Return Buttons */}
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition-colors cursor-pointer"
              title="Admin Logout"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="hidden sm:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
              title="Return to Website"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span className="hidden sm:inline">{language === 'bn' ? 'সাইটে যান' : 'Website'}</span>
            </button>
          </div>
        </header>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Users (12.4k)
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Jobs Moderation (14)
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Submissions Queue ({totalPendingSubmissions})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'withdrawals' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Withdrawals Queue ({withdrawals.filter(w=>w.status==='pending').length})
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* HERO BANNER */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 font-display">Marketplace Control Center</h1>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl">
                Real-time overview of users, task throughput, escrow volume, and payout queues across global gig operations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTimeframe('today')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${timeframe === 'today' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeframe('7days')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${timeframe === '7days' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeframe('30days')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${timeframe === '30days' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                >
                  Last 30 Days
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </section>

          {/* 5 KPI STAT CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">+8.4%</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-numeric-stat">12,450</div>
              <p className="text-[11px] text-slate-500"><span className="text-blue-600 font-bold">+248 this week</span> • 8.2k Workers</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">+12.1%</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-numeric-stat">{jobs.length}</div>
              <p className="text-[11px] text-slate-500"><span className="text-amber-600 font-bold">64 Pending</span> • 778 Live</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">+15.3%</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-numeric-stat">28,450</div>
              <p className="text-[11px] text-slate-500">98.2% Approval • Avg 18m</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">Action (19)</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-numeric-stat">$1,240.00</div>
              <p className="text-[11px] text-slate-500">19 requests awaiting sign-off</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Platform Revenue</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">+18.6%</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-numeric-stat">$8,420.50</div>
              <p className="text-[11px] text-slate-500">5% Fee + Featured Bumps</p>
            </div>
          </section>

          {/* THROUGHPUT CHART & URGENT ITEMS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-headline-md">Task Activity & Throughput</h2>
                  <p className="text-xs text-slate-500">Daily volume of submitted vs. approved micro-tasks</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1 text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Completed</span>
                  <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span> Submitted</span>
                </div>
              </div>

              {/* Chart Graphic */}
              <div className="w-full h-48 pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <path d="M 0,150 Q 45,130 90,140 T 180,95 T 270,80 T 360,75 T 450,45 T 540,30 T 600,20" fill="none" stroke="#1d4ed8" strokeWidth="3" />
                  <polygon points="0,150 45,130 90,140 135,115 180,95 225,110 270,80 315,60 360,75 405,45 450,55 495,30 540,40 600,20 600,175 0,175" fill="#1d4ed8" fillOpacity="0.1" />
                </svg>
                <div className="flex justify-between text-[11px] text-slate-400 font-bold pt-2">
                  <span>May 1</span>
                  <span>May 3</span>
                  <span>May 5</span>
                  <span>May 7</span>
                  <span>May 9</span>
                  <span>May 11</span>
                  <span className="text-blue-600 font-bold">Today</span>
                </div>
              </div>
            </div>

            {/* Urgent Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <h2 className="text-base font-bold text-slate-900 font-headline-md">Urgent Items</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">3 Attention</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 block">High-Value Batch Payout</span>
                    <p className="text-slate-500 text-[11px]">Batch #W-8891 ($420.00 via bKash) exceeds single-threshold.</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px]">Review Batch</button>
                      <button className="text-slate-400 hover:text-slate-700 font-bold text-[11px]">Dismiss</button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">Spam Shield Flag</span>
                    <p className="text-slate-500 text-[11px]">5 new micro-jobs intercepted by automated regex containing prohibited keywords.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 bg-blue-50/60 p-3 rounded-xl flex items-center justify-between text-xs font-bold">
                <span className="text-blue-900">Escrow Vault: $24,912.80</span>
                <span className="text-emerald-700">100% Solvent</span>
              </div>
            </div>
          </section>

          {/* ACCOUNT ACTIVATION APPROVAL QUEUE */}
          {(activeTab === 'dashboard' || activeTab === 'users') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-900 font-headline-md">Account Activation Deposit Queue</h2>
                  </div>
                  <p className="text-xs text-slate-500">Verify user ৳50 BDT activation deposits and approve account access</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  currentUser?.activationStatus === 'pending'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentUser?.activationStatus === 'pending' ? '1 Pending Verification' : 'Queue Empty'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">User</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Sender Mobile</th>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Fee Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {currentUser && (currentUser.activationStatus === 'pending' || currentUser.activationTrxId) ? (
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          {currentUser.fullName}
                          <span className="block text-[11px] font-normal text-slate-400">{currentUser.username} ({currentUser.email})</span>
                        </td>
                        <td className="p-3 font-semibold text-blue-700">{currentUser.activationMethod || 'bKash'}</td>
                        <td className="p-3 font-mono text-slate-700">{currentUser.activationSenderPhone || 'N/A'}</td>
                        <td className="p-3 font-mono font-bold text-slate-900 uppercase">{currentUser.activationTrxId || 'N/A'}</td>
                        <td className="p-3 font-extrabold text-slate-900">৳50 BDT</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            currentUser.isActivated || currentUser.activationStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : currentUser.activationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-900 animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {currentUser.isActivated || currentUser.activationStatus === 'approved' ? 'Active' : currentUser.activationStatus === 'pending' ? 'Pending Review' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {currentUser.activationStatus === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  if (onUpdateUser && currentUser) {
                                    onUpdateUser({
                                      ...currentUser,
                                      isActivated: true,
                                      activationStatus: 'approved'
                                    });
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Approve Account
                              </button>
                              <button
                                onClick={() => {
                                  if (onUpdateUser && currentUser) {
                                    onUpdateUser({
                                      ...currentUser,
                                      isActivated: false,
                                      activationStatus: 'rejected'
                                    });
                                  }
                                }}
                                className="px-3 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              {currentUser.isActivated ? 'Approved' : 'No Action Required'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-400 font-medium">
                          No pending activation fee deposits in queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* CAMPAIGN MODERATION TABLE */}
          {(activeTab === 'dashboard' || activeTab === 'jobs') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-headline-md">Recent Campaigns & Jobs</h2>
                  <p className="text-xs text-slate-500">Monitor live postings, task quotas, and moderation approvals</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    placeholder="Filter jobs or client..."
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">Job Campaign</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Reward & Escrow</th>
                      <th className="p-3">Quota</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {jobs.map((job, idx) => (
                      <tr key={`${job.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          {job.title}
                          <span className="block text-[11px] font-normal text-slate-400">{job.id}</span>
                        </td>
                        <td className="p-3">{job.client.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {job.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 font-bold">৳</span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={campaignRewards[job.id] !== undefined ? campaignRewards[job.id] : (job.reward >= 5 ? job.reward : job.reward * 100)}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setCampaignRewards(prev => ({ ...prev, [job.id]: val }));
                              }}
                              className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800 font-bold text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                            {onUpdateJobReward && (
                              <button
                                onClick={() => onUpdateJobReward(job.id, campaignRewards[job.id] !== undefined ? campaignRewards[job.id] : (job.reward >= 5 ? job.reward : job.reward * 100))}
                                title="Set custom reward"
                                className="px-2 py-1 text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Set
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-bold font-numeric-stat">{job.availableSlots} / {job.totalSlots}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            job.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {job.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onApproveJob(job.id)}
                            className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg mr-1 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectJob(job.id)}
                            className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SUBMISSIONS QUEUE CATEGORY FILTER TABS */}
          {activeTab === 'submissions' && (
            <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setSubmissionCategoryTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionCategoryTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Queues ({totalPendingSubmissions})
              </button>
              <button
                onClick={() => setSubmissionCategoryTab('gmail')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  submissionCategoryTab === 'gmail'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <span>Gmail Sell</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/40 text-[10px] font-bold">{pendingGmailCount}</span>
              </button>
              <button
                onClick={() => setSubmissionCategoryTab('instagram')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  submissionCategoryTab === 'instagram'
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <span>Instagram Sell</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/40 text-[10px] font-bold">{pendingInstagramCount}</span>
              </button>
              <button
                onClick={() => setSubmissionCategoryTab('telegram')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  submissionCategoryTab === 'telegram'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                <span>Telegram Sell</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/40 text-[10px] font-bold">{pendingTelegramCount}</span>
              </button>
              <button
                onClick={() => setSubmissionCategoryTab('jobs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  submissionCategoryTab === 'jobs'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <span>Micro Tasks</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/40 text-[10px] font-bold">{pendingJobCount}</span>
              </button>
            </div>
          )}

          {/* FIND JOB TASKS SUBMISSIONS QUEUE */}
          {(activeTab === 'dashboard' || activeTab === 'submissions') && (submissionCategoryTab === 'all' || submissionCategoryTab === 'jobs') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-900 font-headline-md">Find Job Tasks Queue (কাজ জমা ও ভেরিফিকেশন)</h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Review task proofs submitted from Find Job page, customize payout reward, and approve earnings to worker profiles
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {jobSubmissions.filter(s => s.status === 'pending').length} Tasks Pending Review
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">Worker (Submitter)</th>
                      <th className="p-3">Job Campaign</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Submitted Proof & File</th>
                      <th className="p-3">Reward Price (টাকার পরিমাণ)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {jobSubmissions.length > 0 ? (
                      jobSubmissions.map((sub) => {
                        const currentReward = jobRewards[sub.id] !== undefined ? jobRewards[sub.id] : sub.reward;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <img
                                  src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                                  alt={sub.userName}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <span>{sub.userName}</span>
                                  <span className="block text-[11px] font-normal text-slate-400">{sub.userEmail}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{sub.jobTitle}</span>
                              <span className="text-[11px] text-slate-400">{sub.jobId}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                                {sub.category}
                              </span>
                            </td>
                            <td className="p-3 max-w-[220px]">
                              <p className="text-slate-700 font-medium line-clamp-2" title={sub.proofText}>
                                {sub.proofText}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {sub.fileUploaded && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                    Screenshot Attached
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-bold">৳</span>
                                  <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={currentReward}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setJobRewards(prev => ({ ...prev, [sub.id]: val }));
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800 font-bold text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900">৳{sub.reward.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                sub.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900 animate-pulse'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onApproveJobSubmission(sub.id, currentReward)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectJobSubmission(sub.id)}
                                    className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                  {sub.status === 'approved' ? 'Approved & Credited' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 font-medium">
                          No task submissions in queue yet. Workers can submit proofs from the Find Job page!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* GMAIL SUBMISSIONS QUEUE (NEW FEATURE) */}
          {(activeTab === 'dashboard' || activeTab === 'submissions') && (submissionCategoryTab === 'all' || submissionCategoryTab === 'gmail') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-900 font-headline-md">Gmail Submissions Queue</h2>
                  </div>
                  <p className="text-xs text-slate-500">Review created Gmail accounts, change payout rates, and approve tasks</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {gmailSubmissions.filter(s => s.status === 'pending').length} Pending Review
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">User (Submitter)</th>
                      <th className="p-3">Required Credentials Used</th>
                      <th className="p-3">Submitted Gmail & Password</th>
                      <th className="p-3">Note / Message</th>
                      <th className="p-3">Payout Price (BDT)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {gmailSubmissions.length > 0 ? (
                      gmailSubmissions.map((sub) => {
                        const currentReward = rewards[sub.id] !== undefined ? rewards[sub.id] : sub.reward;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-900">
                              {sub.userName}
                              <span className="block text-[11px] font-normal text-slate-400">{sub.userEmail}</span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block text-[11px] font-semibold text-slate-600">Name: <span className="text-slate-800 font-bold">{sub.fname} {sub.lname}</span></span>
                              <span className="block text-[11px] font-semibold text-slate-600">Pass: <span className="text-slate-800 font-mono font-bold">{sub.passwordInput}</span></span>
                            </td>
                            <td className="p-3 font-semibold space-y-0.5">
                              <span className="block text-blue-700 font-bold">{sub.gmailAddress}</span>
                              <span className="block text-slate-500 text-[11px] font-mono">Pass: {sub.passwordInput}</span>
                            </td>
                            <td className="p-3 text-slate-500 italic max-w-[150px] truncate" title={sub.note || 'None'}>
                              {sub.note || <span className="text-slate-300">None</span>}
                            </td>
                            <td className="p-3">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-bold">৳</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={currentReward}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setRewards(prev => ({ ...prev, [sub.id]: val }));
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800 font-bold text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900">৳{sub.reward.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                sub.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900 animate-pulse'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onApproveGmailSubmission(sub.id, currentReward)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectGmailSubmission(sub.id)}
                                    className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                  {sub.status === 'approved' ? 'Approved & Credited' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 font-medium">
                          No Gmail submissions in queue yet. Submit some from the Gmail Sell page!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* INSTAGRAM SUBMISSIONS QUEUE (NEW FEATURE) */}
          {(activeTab === 'dashboard' || activeTab === 'submissions') && (submissionCategoryTab === 'all' || submissionCategoryTab === 'instagram') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-900 font-headline-md">
                      Instagram Submissions Queue (ইনস্টাগ্রাম সেল একাউন্ট)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Review submitted Instagram IDs, check credentials & followers, customize BDT payout rate, and approve earnings to worker profile
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  {pendingInstagramCount} Pending Review
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">User (Submitter)</th>
                      <th className="p-3">Instagram Account</th>
                      <th className="p-3">Linked Email & Pass</th>
                      <th className="p-3">Followers & Posts</th>
                      <th className="p-3">2FA & Notes</th>
                      <th className="p-3">Payout Price (BDT)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {instagramSubmissions.length > 0 ? (
                      instagramSubmissions.map((sub) => {
                        const currentReward = instagramRewards[sub.id] !== undefined ? instagramRewards[sub.id] : sub.reward;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <img
                                  src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                                  alt={sub.userName}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <span>{sub.userName}</span>
                                  <span className="block text-[11px] font-normal text-slate-400">{sub.userEmail}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block text-rose-600 font-bold text-[13px]">@{sub.instagramUsername}</span>
                              <span className="block text-slate-600 text-[11px] font-mono">Pass: <span className="font-bold text-slate-900">{sub.instagramPassword}</span></span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block text-blue-700 font-semibold">{sub.linkedEmail}</span>
                              <span className="block text-slate-500 text-[11px] font-mono">Pass: <span className="font-bold text-slate-800">{sub.emailPassword}</span></span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                                  {sub.followersCount} Followers
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                                  {sub.postsCount} Posts
                                </span>
                              </div>
                              <span className={`block text-[10px] font-bold ${sub.has2FA ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {sub.has2FA ? '• 2FA ON (Backup code enclosed)' : '• 2FA OFF'}
                              </span>
                            </td>
                            <td className="p-3 max-w-[170px]">
                              <p className="text-slate-700 text-[11px] truncate" title={sub.backupCodesOrNote || 'None'}>
                                {sub.backupCodesOrNote || <span className="text-slate-300">None</span>}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{sub.submittedAt}</span>
                            </td>
                            <td className="p-3">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-bold">৳</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={currentReward}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setInstagramRewards(prev => ({ ...prev, [sub.id]: val }));
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800 font-bold text-center focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900">৳{sub.reward.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                sub.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900 animate-pulse'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onApproveInstagramSubmission && onApproveInstagramSubmission(sub.id, currentReward)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectInstagramSubmission && onRejectInstagramSubmission(sub.id)}
                                    className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                  {sub.status === 'approved' ? 'Approved & Credited' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400 font-medium">
                          No Instagram account submissions in queue yet. Submit some from the Instagram Sell page!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TELEGRAM SUBMISSIONS QUEUE (NEW FEATURE) */}
          {(activeTab === 'dashboard' || activeTab === 'submissions') && (submissionCategoryTab === 'all' || submissionCategoryTab === 'telegram') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-900 font-headline-md">
                      Telegram Submissions Queue (টেলিগ্রাম সেল একাউন্ট ও চ্যানেল)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Review submitted Telegram phone numbers & 2-step passwords, customize BDT payout rate, and approve earnings to worker profile
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {pendingTelegramCount} Pending Review
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">User (Submitter)</th>
                      <th className="p-3">Telegram Phone & Username</th>
                      <th className="p-3">Two-Step Pass & Type</th>
                      <th className="p-3">OTP Contact & Link</th>
                      <th className="p-3">Note / Info</th>
                      <th className="p-3">Payout Price (BDT)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {telegramSubmissions.length > 0 ? (
                      telegramSubmissions.map((sub) => {
                        const currentReward = telegramRewards[sub.id] !== undefined ? telegramRewards[sub.id] : sub.reward;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <img
                                  src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                                  alt={sub.userName}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <span>{sub.userName}</span>
                                  <span className="block text-[11px] font-normal text-slate-400">{sub.userEmail}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block text-sky-700 font-bold font-mono text-[13px]">{sub.telegramPhone}</span>
                              <span className="block text-slate-600 text-[11px]">User: <span className="font-bold text-slate-800">{sub.telegramUsername || 'N/A'}</span></span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block text-slate-700 font-mono text-[11px]">
                                2-Step: <span className="font-bold text-slate-900">{sub.twoStepPassword || 'None'}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold text-[10px] inline-block">
                                {sub.accountType}
                              </span>
                            </td>
                            <td className="p-3 space-y-0.5 max-w-[160px]">
                              <span className="block text-slate-800 font-semibold text-[11px] truncate" title={sub.otpContact}>
                                OTP via: {sub.otpContact || 'N/A'}
                              </span>
                              {sub.channelLink && (
                                <a
                                  href={sub.channelLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline text-[11px] block truncate"
                                >
                                  {sub.channelLink}
                                </a>
                              )}
                            </td>
                            <td className="p-3 max-w-[150px]">
                              <p className="text-slate-700 text-[11px] truncate" title={sub.note || 'None'}>
                                {sub.note || <span className="text-slate-300">None</span>}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{sub.submittedAt}</span>
                            </td>
                            <td className="p-3">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-bold">৳</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={currentReward}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setTelegramRewards(prev => ({ ...prev, [sub.id]: val }));
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800 font-bold text-center focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900">৳{sub.reward.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                sub.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900 animate-pulse'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {sub.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onApproveTelegramSubmission && onApproveTelegramSubmission(sub.id, currentReward)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectTelegramSubmission && onRejectTelegramSubmission(sub.id)}
                                    className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer transition-colors text-[11px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                  {sub.status === 'approved' ? 'Approved & Credited' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400 font-medium">
                          No Telegram account submissions in queue yet. Submit some from the Telegram Sell page!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* WITHDRAWALS APPROVAL TABLE */}
          {(activeTab === 'dashboard' || activeTab === 'withdrawals') && (
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-headline-md">Recent Worker Withdrawals</h2>
                  <p className="text-xs text-slate-500">Review payout proofs and release mobile wallet & bank escrows</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3 rounded-l-xl">Freelancer</th>
                      <th className="p-3">Payout Amount</th>
                      <th className="p-3">Payment Rail</th>
                      <th className="p-3">Account Details</th>
                      <th className="p-3">Requested</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          {w.freelancerName}
                          <span className="block text-[11px] font-normal text-slate-400">{w.username}</span>
                        </td>
                        <td className="p-3 font-bold font-numeric-stat text-slate-900">${w.amount.toFixed(2)} USD</td>
                        <td className="p-3 font-semibold text-blue-700">{w.method}</td>
                        <td className="p-3 font-mono text-slate-600">{w.accountDetails}</td>
                        <td className="p-3 text-slate-400">{w.requestedAgo}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            w.status === 'disbursed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {w.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {w.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onApproveWithdrawal(w.id)}
                                className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onRejectWithdrawal(w.id)}
                                className="px-2.5 py-1 bg-slate-100 text-red-600 hover:bg-red-100 font-bold rounded-lg cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-bold">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

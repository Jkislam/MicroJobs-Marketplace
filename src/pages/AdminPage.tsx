import React, { useState } from 'react';
import { Job, WithdrawalRequest, PageType, UserProfileData, GmailSubmission } from '../types';

interface AdminPageProps {
  jobs: Job[];
  withdrawals: WithdrawalRequest[];
  gmailSubmissions: GmailSubmission[];
  onNavigate: (page: PageType) => void;
  onApproveJob: (jobId: string) => void;
  onRejectJob: (jobId: string) => void;
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  onApproveGmailSubmission: (id: string, updatedReward: number) => void;
  onRejectGmailSubmission: (id: string) => void;
  currentUser?: UserProfileData;
  onUpdateUser?: (updated: UserProfileData) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  jobs,
  withdrawals,
  gmailSubmissions,
  onNavigate,
  onApproveJob,
  onRejectJob,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onApproveGmailSubmission,
  onRejectGmailSubmission,
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'jobs' | 'submissions' | 'withdrawals'>('dashboard');
  const [timeframe, setTimeframe] = useState('30days');
  const [jobFilter, setJobFilter] = useState('');
  const [proofViewerOpen, setProofViewerOpen] = useState(false);
  const [rewards, setRewards] = useState<Record<string, number>>({});

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
                {gmailSubmissions.filter(s => s.status === 'pending').length}
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
            onClick={() => onNavigate('home')}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit Console</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Marketplace Live</span>
            </div>

            <button onClick={handleExportCSV} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer" title="Export CSV Data">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
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
            Submissions Queue ({gmailSubmissions.filter(s => s.status === 'pending').length})
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
                        <td className="p-3 font-bold font-numeric-stat">${job.reward.toFixed(2)}</td>
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

          {/* GMAIL SUBMISSIONS QUEUE (NEW FEATURE) */}
          {(activeTab === 'dashboard' || activeTab === 'submissions') && (
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

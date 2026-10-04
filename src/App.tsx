import React, { useState } from 'react';
import { PageType, Job, WithdrawalRequest, UserProfileData, CompletedJobActivity } from './types';
import { INITIAL_JOBS, CATEGORIES_LIST, INITIAL_WITHDRAWALS, MOCK_USER, INITIAL_COMPLETED_ACTIVITIES } from './data/mockData';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JobDetailsModal } from './components/JobDetailsModal';

import { HomePage } from './pages/HomePage';
import { FindJobsPage } from './pages/FindJobsPage';
import { PostJobPage } from './pages/PostJobPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [user, setUser] = useState<UserProfileData>(MOCK_USER);
  const [completedActivities, setCompletedActivities] = useState<CompletedJobActivity[]>(INITIAL_COMPLETED_ACTIVITIES);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Job "${newJob.title}" published successfully! Escrow funded.`);
  };

  const handleSubmitProof = (jobId: string, _proofText: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId && j.availableSlots > 0) {
          return {
            ...j,
            availableSlots: j.availableSlots - 1
          };
        }
        return j;
      })
    );

    const earned = targetJob ? targetJob.reward : 0.50;

    setUser((prev) => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
      totalEarnings: prev.totalEarnings + earned
    }));

    if (targetJob) {
      const newActivity: CompletedJobActivity = {
        id: `cmp-${Date.now()}`,
        userName: user.fullName,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        jobTitle: targetJob.title,
        category: targetJob.category,
        earnedAmount: earned,
        completedAt: 'Just now'
      };
      setCompletedActivities((prev) => [newActivity, ...prev]);
    }

    showToast('Task proof submitted! Payout added to your escrow wallet.');
  };

  const handleApproveJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'active' } : j))
    );
    showToast(`Campaign ${jobId} approved and set live.`);
  };

  const handleRejectJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'suspended' } : j))
    );
    showToast(`Campaign ${jobId} rejected / suspended.`);
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'disbursed' } : w))
    );
    showToast(`Withdrawal ${id} approved and funds disbursed.`);
  };

  const handleRejectWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w))
    );
    showToast(`Withdrawal ${id} rejected.`);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-blue-600 selection:text-white font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Navbar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onSearch={() => handleNavigate('find-jobs')}
          isLoggedIn={isLoggedIn}
          onToggleLogin={() => setIsLoggedIn(!isLoggedIn)}
        />

        {/* Main Content Router */}
        <main className="flex-1 pt-20">
          {currentPage === 'home' && (
            <HomePage
              jobs={jobs}
              categories={CATEGORIES_LIST}
              completedActivities={completedActivities}
              onNavigate={handleNavigate}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          )}

          {currentPage === 'find-jobs' && (
            <FindJobsPage
              jobs={jobs}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          )}

          {currentPage === 'post-job' && (
            <PostJobPage
              onAddJob={handleAddJob}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'contact' && <ContactPage />}

          {currentPage === 'login' && (
            <LoginPage
              onNavigate={handleNavigate}
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                showToast('Logged in successfully!');
              }}
            />
          )}

          {currentPage === 'register' && (
            <RegisterPage
              onNavigate={handleNavigate}
              onRegisterSuccess={() => {
                setIsLoggedIn(true);
                showToast('Account created successfully!');
              }}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                showToast('Profile settings saved.');
              }}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              jobs={jobs}
              withdrawals={withdrawals}
              onNavigate={handleNavigate}
              onApproveJob={handleApproveJob}
              onRejectJob={handleRejectJob}
              onApproveWithdrawal={handleApproveWithdrawal}
              onRejectWithdrawal={handleRejectWithdrawal}
            />
          )}
        </main>

        {/* Global Footer (Hidden on Admin screen for full control center canvas) */}
        {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}

        {/* Job Details & Proof Submission Modal */}
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSubmitProof={handleSubmitProof}
        />
      </div>
    </LanguageProvider>
  );
}

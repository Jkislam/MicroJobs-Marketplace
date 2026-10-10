import React, { useState } from 'react';
import { PageType, Job, WithdrawalRequest, UserProfileData, CompletedJobActivity, GmailSubmission, JobSubmission, InstagramSubmission, TelegramSubmission } from './types';
import { INITIAL_JOBS, CATEGORIES_LIST, INITIAL_WITHDRAWALS, MOCK_USER, INITIAL_COMPLETED_ACTIVITIES, INITIAL_JOB_SUBMISSIONS, INITIAL_INSTAGRAM_SUBMISSIONS, INITIAL_TELEGRAM_SUBMISSIONS } from './data/mockData';
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
import { EditProfilePage } from './pages/EditProfilePage';
import { AdminPage } from './pages/AdminPage';
import { GmailSellPage } from './pages/GmailSellPage';
import { InstagramSellPage } from './pages/InstagramSellPage';
import { TelegramSellPage } from './pages/TelegramSellPage';
import { QuranReader } from './pages/QuranReader';
import { PrayerTimesPage } from './pages/PrayerTimesPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [completedActivities, setCompletedActivities] = useState<CompletedJobActivity[]>(INITIAL_COMPLETED_ACTIVITIES);
  const [gmailSubmissions, setGmailSubmissions] = useState<GmailSubmission[]>(() => {
    const saved = localStorage.getItem('microjobs_gmail_submissions');
    return saved ? JSON.parse(saved) : [];
  });
  const [instagramSubmissions, setInstagramSubmissions] = useState<InstagramSubmission[]>(() => {
    const saved = localStorage.getItem('microjobs_instagram_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_INSTAGRAM_SUBMISSIONS;
  });
  const [telegramSubmissions, setTelegramSubmissions] = useState<TelegramSubmission[]>(() => {
    const saved = localStorage.getItem('microjobs_telegram_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TELEGRAM_SUBMISSIONS;
  });
  const [jobSubmissions, setJobSubmissions] = useState<JobSubmission[]>(() => {
    const saved = localStorage.getItem('microjobs_job_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_JOB_SUBMISSIONS;
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Local state persistence for Login & Register
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('microjobs_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [user, setUser] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('microjobs_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_USER;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoginSuccess = (loginEmail?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('microjobs_is_logged_in', JSON.stringify(true));
    if (loginEmail) {
      setUser((prev) => {
        const updated = { ...prev, email: loginEmail };
        localStorage.setItem('microjobs_user', JSON.stringify(updated));
        return updated;
      });
    }
    showToast('Logged in successfully!');
  };

  const handleRegisterSuccess = (details: {
    fullName: string;
    username: string;
    email: string;
    role: 'worker' | 'client';
  }) => {
    const formattedUsername = details.username ? (details.username.startsWith('@') ? details.username : `@${details.username}`) : user.username;
    const updatedUser: UserProfileData = {
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      fullName: details.fullName,
      username: formattedUsername,
      email: details.email,
      phone: '',
      country: 'Bangladesh',
      bio: '',
      role: details.role || 'worker',
      memberSince: 'Oct 2026',
      kycLevel: 'KYC Level 1',
      completedTasks: 0,
      totalEarnings: 0,
      jobsPosted: 0,
      overallRating: 0,
      reviewsCount: 0,
      isActivated: false,
      activationStatus: 'none',
      payoutAccounts: []
    };
    setUser(updatedUser);
    localStorage.setItem('microjobs_user', JSON.stringify(updatedUser));
    setIsLoggedIn(true);
    localStorage.setItem('microjobs_is_logged_in', JSON.stringify(true));
    showToast('Account created successfully!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('microjobs_is_logged_in', JSON.stringify(false));
    showToast('Logged out successfully.');
    handleNavigate('login');
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Job "${newJob.title}" published successfully! Escrow funded.`);
  };

  const handleSubmitProof = (jobId: string, proofText: string, fileUploaded?: boolean) => {
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

    const defaultReward = targetJob ? (targetJob.reward >= 5 ? targetJob.reward : targetJob.reward * 100) : 35.00;

    const newSubmission: JobSubmission = {
      id: `sub-jb-${Date.now()}`,
      jobId: targetJob ? targetJob.id : jobId,
      jobTitle: targetJob ? targetJob.title : 'Marketplace Job',
      category: targetJob ? targetJob.category : 'General',
      proofText: proofText || 'Proof submitted',
      fileUploaded: !!fileUploaded,
      reward: defaultReward,
      status: 'pending',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userEmail: user.email,
      userName: user.fullName,
      userAvatar: user.avatar
    };

    setJobSubmissions((prev) => {
      const updated = [newSubmission, ...prev];
      localStorage.setItem('microjobs_job_submissions', JSON.stringify(updated));
      return updated;
    });

    showToast('কাজটি সফলভাবে জমা হয়েছে! অ্যাডমিন প্যানেলে অনুমোদনের অপেক্ষায় আছে।');
  };

  const handleApproveJobSubmission = (id: string, updatedReward: number) => {
    setJobSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          const isCurrentUser = sub.userEmail === user.email;
          if (isCurrentUser) {
            setUser((prevUser) => {
              const newUser = {
                ...prevUser,
                completedTasks: prevUser.completedTasks + 1,
                totalEarnings: prevUser.totalEarnings + updatedReward
              };
              localStorage.setItem('microjobs_user', JSON.stringify(newUser));
              return newUser;
            });
            
            const newActivity: CompletedJobActivity = {
              id: `cmp-job-${Date.now()}`,
              userName: sub.userName,
              userAvatar: sub.userAvatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              jobTitle: sub.jobTitle,
              category: sub.category,
              earnedAmount: updatedReward,
              completedAt: 'Just now'
            };
            setCompletedActivities((prevAct) => [newActivity, ...prevAct]);
          }
          return { ...sub, status: 'approved' as const, reward: updatedReward };
        }
        return sub;
      });
      localStorage.setItem('microjobs_job_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`কাজটি অনুমোদিত হয়েছে! একাউন্টে ৳${updatedReward} জমা করা হয়েছে।`);
  };

  const handleRejectJobSubmission = (id: string) => {
    setJobSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, status: 'rejected' as const };
        }
        return sub;
      });
      localStorage.setItem('microjobs_job_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast('কাজটি বাতিল (Reject) করা হয়েছে।');
  };

  const handleUpdateJobReward = (jobId: string, newReward: number) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, reward: newReward } : j))
    );
    showToast(`কাজের টাকার পরিমাণ ৳${newReward} নির্ধারণ করা হয়েছে।`);
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
  const handleApproveGmailSubmission = (id: string, updatedReward: number) => {
    setGmailSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          const isCurrentUser = sub.userEmail === user.email;
          if (isCurrentUser) {
            setUser((prevUser) => {
              const newUser = {
                ...prevUser,
                completedTasks: prevUser.completedTasks + 1,
                totalEarnings: prevUser.totalEarnings + updatedReward
              };
              localStorage.setItem('microjobs_user', JSON.stringify(newUser));
              return newUser;
            });
            
            const newActivity: CompletedJobActivity = {
              id: `cmp-gmail-${Date.now()}`,
              userName: sub.userName,
              userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              jobTitle: `Gmail Sale: ${sub.gmailAddress}`,
              category: 'Gmail Sell',
              earnedAmount: updatedReward,
              completedAt: 'Just now'
            };
            setCompletedActivities((prevAct) => [newActivity, ...prevAct]);
          }
          return { ...sub, status: 'approved' as const, reward: updatedReward };
        }
        return sub;
      });
      localStorage.setItem('microjobs_gmail_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`Gmail submission approved! Credited ৳${updatedReward} to user.`);
  };

  const handleRejectGmailSubmission = (id: string) => {
    setGmailSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, status: 'rejected' as const };
        }
        return sub;
      });
      localStorage.setItem('microjobs_gmail_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast('Gmail submission rejected.');
  };

  const handleApproveInstagramSubmission = (id: string, updatedReward: number) => {
    setInstagramSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          const isCurrentUser = sub.userEmail === user.email;
          if (isCurrentUser) {
            setUser((prevUser) => {
              const newUser = {
                ...prevUser,
                completedTasks: prevUser.completedTasks + 1,
                totalEarnings: prevUser.totalEarnings + updatedReward
              };
              localStorage.setItem('microjobs_user', JSON.stringify(newUser));
              return newUser;
            });

            const newActivity: CompletedJobActivity = {
              id: `cmp-ig-${Date.now()}`,
              userName: sub.userName,
              userAvatar: sub.userAvatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              jobTitle: `Instagram Sale: @${sub.instagramUsername}`,
              category: 'Instagram Sell',
              earnedAmount: updatedReward,
              completedAt: 'Just now'
            };
            setCompletedActivities((prevAct) => [newActivity, ...prevAct]);
          }
          return { ...sub, status: 'approved' as const, reward: updatedReward };
        }
        return sub;
      });
      localStorage.setItem('microjobs_instagram_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`ইনস্টাগ্রাম সেল অনুমোদিত হয়েছে! একাউন্টে ৳${updatedReward} জমা হয়েছে।`);
  };

  const handleRejectInstagramSubmission = (id: string) => {
    setInstagramSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, status: 'rejected' as const };
        }
        return sub;
      });
      localStorage.setItem('microjobs_instagram_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast('ইনস্টাগ্রাম সেল বাতিল (Rejected) করা হয়েছে।');
  };

  const handleApproveTelegramSubmission = (id: string, updatedReward: number) => {
    setTelegramSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          const isCurrentUser = sub.userEmail === user.email;
          if (isCurrentUser) {
            setUser((prevUser) => {
              const newUser = {
                ...prevUser,
                completedTasks: prevUser.completedTasks + 1,
                totalEarnings: prevUser.totalEarnings + updatedReward
              };
              localStorage.setItem('microjobs_user', JSON.stringify(newUser));
              return newUser;
            });

            const newActivity: CompletedJobActivity = {
              id: `cmp-tg-${Date.now()}`,
              userName: sub.userName,
              userAvatar: sub.userAvatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              jobTitle: `Telegram Sale: ${sub.telegramPhone}`,
              category: 'Telegram Sell',
              earnedAmount: updatedReward,
              completedAt: 'Just now'
            };
            setCompletedActivities((prevAct) => [newActivity, ...prevAct]);
          }
          return { ...sub, status: 'approved' as const, reward: updatedReward };
        }
        return sub;
      });
      localStorage.setItem('microjobs_telegram_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`টেলিগ্রাম সেল অনুমোদিত হয়েছে! একাউন্টে ৳${updatedReward} জমা হয়েছে।`);
  };

  const handleRejectTelegramSubmission = (id: string) => {
    setTelegramSubmissions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, status: 'rejected' as const };
        }
        return sub;
      });
      localStorage.setItem('microjobs_telegram_submissions', JSON.stringify(updated));
      return updated;
    });
    showToast('টেলিগ্রাম সেল বাতিল (Rejected) করা হয়েছে।');
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

        {/* Global Navbar (Separated from Admin console) */}
        {currentPage !== 'admin' && (
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            user={user}
            onSearch={() => handleNavigate('find-jobs')}
            isLoggedIn={isLoggedIn}
            onToggleLogin={handleLogout}
          />
        )}

        {/* Main Content Router */}
        <main className={`flex-1 ${currentPage === 'admin' ? '' : 'pt-20'}`}>
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
              categories={CATEGORIES_LIST}
              jobs={jobs}
              onNavigate={handleNavigate}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          )}

          {currentPage === 'gmail-sell' && (
            <GmailSellPage
              onNavigate={handleNavigate}
              onSubmitGmail={(gmailAddress, pass, fname, lname, note) => {
                const newSubmission: GmailSubmission = {
                  id: `gsub-${Date.now()}`,
                  gmailAddress,
                  passwordInput: pass,
                  fname,
                  lname,
                  note: note || '',
                  reward: 50.00,
                  status: 'pending',
                  submittedAt: new Date().toLocaleString(),
                  userEmail: user.email,
                  userName: user.fullName
                };
                
                setGmailSubmissions((prev) => {
                  const updated = [newSubmission, ...prev];
                  localStorage.setItem('microjobs_gmail_submissions', JSON.stringify(updated));
                  return updated;
                });
                
                showToast('Gmail account submitted! ৳50 reward pending review.');
              }}
            />
          )}

          {currentPage === 'instagram-sell' && (
            <InstagramSellPage
              onNavigate={handleNavigate}
              onSubmitInstagram={(username, pass, email, emailPass, followers, posts, has2FA, backupNote) => {
                const newSubmission: InstagramSubmission = {
                  id: `igsub-${Date.now()}`,
                  instagramUsername: username,
                  instagramPassword: pass,
                  linkedEmail: email,
                  emailPassword: emailPass,
                  followersCount: followers,
                  postsCount: posts,
                  has2FA,
                  backupCodesOrNote: backupNote,
                  reward: 120.00,
                  status: 'pending',
                  submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  userEmail: user.email,
                  userName: user.fullName,
                  userAvatar: user.avatar
                };

                setInstagramSubmissions((prev) => {
                  const updated = [newSubmission, ...prev];
                  localStorage.setItem('microjobs_instagram_submissions', JSON.stringify(updated));
                  return updated;
                });

                showToast('ইনস্টাগ্রাম একাউন্ট জমা হয়েছে! ৳১২০ রিওয়ার্ড রিভিউ পেন্ডিং আছে।');
              }}
            />
          )}

          {currentPage === 'telegram-sell' && (
            <TelegramSellPage
              onNavigate={handleNavigate}
              onSubmitTelegram={(phone, username, twoStep, type, link, otp, note) => {
                const newSubmission: TelegramSubmission = {
                  id: `tgsub-${Date.now()}`,
                  telegramPhone: phone,
                  telegramUsername: username,
                  twoStepPassword: twoStep,
                  accountType: type,
                  channelLink: link,
                  otpContact: otp,
                  note: note || '',
                  reward: 80.00,
                  status: 'pending',
                  submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  userEmail: user.email,
                  userName: user.fullName,
                  userAvatar: user.avatar
                };

                setTelegramSubmissions((prev) => {
                  const updated = [newSubmission, ...prev];
                  localStorage.setItem('microjobs_telegram_submissions', JSON.stringify(updated));
                  return updated;
                });

                showToast('টেলিগ্রাম একাউন্ট জমা হয়েছে! ৳৮০ রিওয়ার্ড রিভিউ পেন্ডিং আছে।');
              }}
            />
          )}

          {currentPage === 'quran' && (
            <QuranReader
              onNavigate={handleNavigate}
              onAddCoins={(coins) => {
                setUser((prev) => {
                  const updated = {
                    ...prev,
                    completedTasks: prev.completedTasks + 1,
                    totalEarnings: Number((prev.totalEarnings + (coins * 0.1)).toFixed(2))
                  };
                  localStorage.setItem('microjobs_user', JSON.stringify(updated));
                  return updated;
                });
                showToast(`মাশাআল্লাহ! পবিত্র কোরআন তিলাওয়াত থেকে +${coins} টি কয়েন সফলভাবে জমা হয়েছে!`);
              }}
            />
          )}

          {(currentPage === 'namaj' || currentPage === 'prayer-times') && (
            <PrayerTimesPage
              onNavigate={handleNavigate}
              onAddCoins={(coins, reason) => {
                setUser((prev) => {
                  const updated = {
                    ...prev,
                    completedTasks: prev.completedTasks + 1,
                    totalEarnings: Number((prev.totalEarnings + (coins * 0.1)).toFixed(2))
                  };
                  localStorage.setItem('microjobs_user', JSON.stringify(updated));
                  return updated;
                });
                if (reason) {
                  showToast(reason);
                } else if (coins >= 10) {
                  showToast(`আলহামদুলিল্লাহ! দৈনিক ৫ ওয়াক্ত নামাজ সম্পন্ন করার জন্য +${coins} টি কয়েন বোনাস জমা হয়েছে!`);
                } else {
                  showToast(`আলহামদুলিল্লাহ! নামাজ ট্র্যাকার থেকে +${coins} টি কয়েন উপরে যুক্ত হয়েছে!`);
                }
              }}
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
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentPage === 'register' && (
            <RegisterPage
              onNavigate={handleNavigate}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              user={user}
              withdrawals={withdrawals}
              onNavigate={handleNavigate}
              onUpdateUser={(updated) => {
                setUser(updated);
                localStorage.setItem('microjobs_user', JSON.stringify(updated));
                showToast('Profile settings saved.');
              }}
            />
          )}

          {currentPage === 'edit-profile' && (
            <EditProfilePage
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={(updated) => {
                setUser(updated);
                localStorage.setItem('microjobs_user', JSON.stringify(updated));
                showToast('Profile information updated successfully!');
              }}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              jobs={jobs}
              withdrawals={withdrawals}
              gmailSubmissions={gmailSubmissions}
              instagramSubmissions={instagramSubmissions}
              telegramSubmissions={telegramSubmissions}
              jobSubmissions={jobSubmissions}
              onNavigate={handleNavigate}
              onApproveJob={handleApproveJob}
              onRejectJob={handleRejectJob}
              onUpdateJobReward={handleUpdateJobReward}
              onApproveWithdrawal={handleApproveWithdrawal}
              onRejectWithdrawal={handleRejectWithdrawal}
              onApproveGmailSubmission={handleApproveGmailSubmission}
              onRejectGmailSubmission={handleRejectGmailSubmission}
              onApproveInstagramSubmission={handleApproveInstagramSubmission}
              onRejectInstagramSubmission={handleRejectInstagramSubmission}
              onApproveTelegramSubmission={handleApproveTelegramSubmission}
              onRejectTelegramSubmission={handleRejectTelegramSubmission}
              onApproveJobSubmission={handleApproveJobSubmission}
              onRejectJobSubmission={handleRejectJobSubmission}
              currentUser={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                localStorage.setItem('microjobs_user', JSON.stringify(updated));
                showToast('Account activation updated!');
              }}
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

import React from 'react';
import { PageType, UserProfileData } from '../types';

interface LeaderShiftPageProps {
  onNavigate: (page: PageType) => void;
  user: UserProfileData;
  gmailSubmissionsCount?: number;
  instagramSubmissionsCount?: number;
  telegramSubmissionsCount?: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  referrals: number;
  gmailSales: number;
  instagramSales: number;
  telegramSales: number;
  totalScore: number;
  allowance: string;
}

export const LeaderShiftPage: React.FC<LeaderShiftPageProps> = ({
  onNavigate,
  user,
  gmailSubmissionsCount = 0,
  instagramSubmissionsCount = 0,
  telegramSubmissionsCount = 0,
}) => {
  // Retrieve referral count for current user
  let myReferralCount = 0;
  try {
    const countsMapStr = localStorage.getItem('microjobs_referral_counts_map');
    if (countsMapStr) {
      const countsMap = JSON.parse(countsMapStr);
      const cleanUser = user.username.replace('@', '').toLowerCase();
      myReferralCount = countsMap[cleanUser] || 3; // default 3 if not set
    } else {
      myReferralCount = 3;
    }
  } catch {
    myReferralCount = 3;
  }

  const myGmailSales = Math.max(gmailSubmissionsCount, 12);
  const myInstagramSales = Math.max(instagramSubmissionsCount, 15);
  const myTelegramSales = Math.max(telegramSubmissionsCount, 10);
  const myTotal = myReferralCount + myGmailSales + myInstagramSales + myTelegramSales;

  // Build leaderboard list including current user and top workers
  const baseLeaderboardUsers: Omit<LeaderboardUser, 'rank'>[] = [
    {
      name: user.fullName || 'Sabbir Islam',
      username: user.username || '@sabbir',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      referrals: myReferralCount,
      gmailSales: myGmailSales,
      instagramSales: myInstagramSales,
      telegramSales: myTelegramSales,
      totalScore: myTotal,
      allowance: '$50.00 / ৳5,000'
    },
    {
      name: 'Amina Bello',
      username: '@aminab',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      referrals: 28,
      gmailSales: 45,
      instagramSales: 38,
      telegramSales: 30,
      totalScore: 141,
      allowance: '$45.00 / ৳4,500'
    },
    {
      name: 'Carlos Ruiz',
      username: '@carlos_micro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      referrals: 25,
      gmailSales: 40,
      instagramSales: 35,
      telegramSales: 28,
      totalScore: 128,
      allowance: '$40.00 / ৳4,000'
    },
    {
      name: 'Tanvir Khan',
      username: '@tkhan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      referrals: 20,
      gmailSales: 32,
      instagramSales: 30,
      telegramSales: 25,
      totalScore: 107,
      allowance: '$30.00 / ৳3,000'
    },
    {
      name: 'Hasan Mahmud',
      username: '@hasan_growth',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      referrals: 18,
      gmailSales: 28,
      instagramSales: 25,
      telegramSales: 22,
      totalScore: 93,
      allowance: '$25.00 / ৳2,500'
    },
    {
      name: 'Jannat Ara',
      username: '@jannat_design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      referrals: 12,
      gmailSales: 20,
      instagramSales: 18,
      telegramSales: 15,
      totalScore: 65,
      allowance: 'Eligible for Next Tier'
    },
    {
      name: 'Tania Sultana',
      username: '@tania_apps',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      referrals: 10,
      gmailSales: 15,
      instagramSales: 14,
      telegramSales: 12,
      totalScore: 51,
      allowance: 'Eligible for Next Tier'
    }
  ];

  // Sort by totalScore descending
  const sortedUsers = [...baseLeaderboardUsers].sort((a, b) => b.totalScore - a.totalScore);
  const rankedUsers: LeaderboardUser[] = sortedUsers.map((u, index) => ({
    ...u,
    rank: index + 1
  }));

  return (
    <div className="w-full bg-slate-50/60 py-4 sm:py-10">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-extrabold shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">leaderboard</span>
              <span>Leader Shift • Top Performers Ranking</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Leader Shift Monthly Allowance Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Rankings are generated based on the highest referrals, Gmail sales, Instagram sales, and Telegram sales among all users across the entire website. The top 5 performers will receive an attractive monthly allowance every month!
            </p>
          </div>

          <button
            onClick={() => onNavigate('find-jobs')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl sm:rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer self-start sm:self-center shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Find Jobs</span>
          </button>
        </div>

        {/* TOP 3 PODIUM HIGHLIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {rankedUsers.slice(0, 3).map((u, idx) => {
            const podiumColors = [
              'bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-amber-300 shadow-md',
              'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 border-slate-200 shadow-sm',
              'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-amber-600 shadow-sm'
            ];
            const rankBadges = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
            return (
              <div key={u.username} className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 border flex flex-col items-center text-center relative ${podiumColors[idx]}`}>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black bg-white/20 backdrop-blur-xs">
                  {rankBadges[idx]}
                </div>

                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/40 shadow-md mb-3"
                />

                <h3 className="font-extrabold text-sm sm:text-base tracking-tight mb-0.5">{u.name}</h3>
                <p className="text-[11px] sm:text-xs opacity-90 mb-3 sm:mb-4">{u.username}</p>

                <div className="w-full bg-white/10 backdrop-blur-xs rounded-xl sm:rounded-2xl p-3 mb-3 sm:mb-4 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-80">Total Score:</span>
                    <span className="font-black text-xs sm:text-sm">{u.totalScore} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Monthly Allowance:</span>
                    <span className="font-bold">{u.allowance}</span>
                  </div>
                </div>

                <div className="mt-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-900 font-extrabold text-[11px] sm:text-xs shadow-xs">
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-purple-600">verified</span>
                  <span>Monthly Allowance Winner</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Full Leader Shift Rankings</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Ranked by Total Activity (Referrals + Gmail + Instagram + Telegram)</p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-full self-start sm:self-center">
              Top 5 Get Monthly Salary
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4 sm:px-6 whitespace-nowrap">Rank</th>
                  <th className="py-3 px-4 sm:px-6 whitespace-nowrap">User</th>
                  <th className="py-3 px-3 sm:px-6 text-center whitespace-nowrap">Referrals</th>
                  <th className="py-3 px-3 sm:px-6 text-center whitespace-nowrap">Gmail Sales</th>
                  <th className="py-3 px-3 sm:px-6 text-center whitespace-nowrap">Instagram</th>
                  <th className="py-3 px-3 sm:px-6 text-center whitespace-nowrap">Telegram</th>
                  <th className="py-3 px-4 sm:px-6 text-center whitespace-nowrap">Total Score</th>
                  <th className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">Monthly Allowance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-800 font-medium">
                {rankedUsers.map((u) => {
                  const isTop5 = u.rank <= 5;
                  return (
                    <tr key={u.username} className={`hover:bg-slate-50/60 transition-colors ${u.username === user.username ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-black whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs ${
                          u.rank === 1 ? 'bg-amber-500 text-white shadow-xs' :
                          u.rank === 2 ? 'bg-slate-300 text-slate-900 shadow-xs' :
                          u.rank === 3 ? 'bg-amber-700 text-white shadow-xs' :
                          isTop5 ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{u.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-2xs shrink-0" />
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1">
                              <span className="truncate max-w-[120px] sm:max-w-none">{u.name}</span>
                              {u.username === user.username && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] bg-blue-100 text-blue-700 font-bold shrink-0">You</span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] sm:text-xs">{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 sm:px-6 text-center font-bold text-slate-700 whitespace-nowrap">{u.referrals}</td>
                      <td className="py-3.5 px-3 sm:px-6 text-center font-bold text-slate-700 whitespace-nowrap">{u.gmailSales}</td>
                      <td className="py-3.5 px-3 sm:px-6 text-center font-bold text-slate-700 whitespace-nowrap">{u.instagramSales}</td>
                      <td className="py-3.5 px-3 sm:px-6 text-center font-bold text-slate-700 whitespace-nowrap">{u.telegramSales}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-extrabold text-[#1E62EC] whitespace-nowrap">{u.totalScore} pts</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        {isTop5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] sm:text-xs border border-emerald-200">
                            <span className="material-symbols-outlined text-[13px] sm:text-[14px]">verified</span>
                            <span>{u.allowance}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-[11px] sm:text-xs">Rank 6+ (No Allowance)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

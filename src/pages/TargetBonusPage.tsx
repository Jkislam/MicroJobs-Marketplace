import React, { useState, useEffect } from 'react';
import { PageType, UserProfileData } from '../types';

interface TargetBonusPageProps {
  onNavigate: (page: PageType) => void;
  currentUser?: UserProfileData;
  onClaimBonus?: (bonusId: string, bonusAmountUsd: number, title: string) => void;
}

interface TargetBonusTask {
  id: string;
  category: 'referral' | 'recharge' | 'namaj' | 'jobs';
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeText: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  rewardBdt: number;
  rewardUsd: number;
  rewardCoins: number;
  deadlineText: string;
  actionButtonLabel: string;
  actionPageRoute?: PageType;
  rules: string[];
}

export const TargetBonusPage: React.FC<TargetBonusPageProps> = ({
  onNavigate,
  currentUser,
  onClaimBonus
}) => {
  // Read stored progress or initialize with realistic defaults
  const [claimedBonuses, setClaimedBonuses] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('microjobs_claimed_target_bonuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track counts in local storage or state
  const [referralCount, setReferralCount] = useState<number>(() => {
    try {
      const myUsername = currentUser?.username ? currentUser.username.replace('@', '').toLowerCase() : '';
      const countsMapStr = localStorage.getItem('microjobs_referral_counts_map');
      if (countsMapStr && myUsername) {
        const countsMap = JSON.parse(countsMapStr);
        if (countsMap[myUsername] !== undefined) {
          return countsMap[myUsername];
        }
      }
      const saved = localStorage.getItem('microjobs_referral_count');
      return saved ? parseInt(saved, 10) : 4; // 4 out of 10
    } catch {
      return 4;
    }
  });

  const [rechargeCount, setRechargeCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microjobs_mobile_recharges') || localStorage.getItem('microjobs_recharge_requests');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) return Math.min(5, list.length);
      }
      return 0; // Default 0 if no mobile recharges made from Mobile Recharge page
    } catch {
      return 0;
    }
  });

  const [namajDaysStreak, setNamajDaysStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microjobs_namaj_streak_days');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });



  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [claimSuccessModal, setClaimSuccessModal] = useState<{
    title: string;
    rewardBdt: number;
    rewardUsd: number;
    rewardCoins: number;
  } | null>(null);

  // Active filter tab
  const [activeFilter, setActiveFilter] = useState<'all' | 'referral' | 'recharge' | 'namaj'>('all');

  const referralCode = currentUser?.username
    ? currentUser.username.replace('@', '')
    : 'username';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
    }
    setCopyToast('Referral link copied to clipboard! Share it with your friends.');
    setTimeout(() => setCopyToast(null), 3000);
  };

  const targetTasks: TargetBonusTask[] = [
    {
      id: 'target-ref-10',
      category: 'referral',
      title: '1 - 10 Referrals Milestone (Tier 1)',
      description: 'Invite your first 1 to 10 active friends using your personal referral link.',
      icon: 'group_add',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      badgeText: 'Referral 1-10',
      targetCount: 10,
      currentCount: referralCount,
      unit: 'Friends',
      rewardBdt: 250,
      rewardUsd: 2.50,
      rewardCoins: 250,
      deadlineText: 'Valid until month end',
      actionButtonLabel: 'Share Referral Link',
      rules: [
        'Invited friends must sign up and verify their accounts.',
        'Reaching 10 referrals unlocks $2.50 (৳250) + 250 coins.'
      ]
    },
    {
      id: 'target-ref-20',
      category: 'referral',
      title: '10 - 20 Referrals Milestone (Tier 2)',
      description: 'Expand your network from 10 to 20 active referrals to unlock tier 2 bonus rewards.',
      icon: 'group_add',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeText: 'Referral 10-20',
      targetCount: 20,
      currentCount: referralCount,
      unit: 'Friends',
      rewardBdt: 500,
      rewardUsd: 5.00,
      rewardCoins: 500,
      deadlineText: 'Valid until month end',
      actionButtonLabel: 'Share Referral Link',
      rules: [
        'Achieve between 10 and 20 total active referrals.',
        'Unlocks $5.00 (৳500) + 500 coins.'
      ]
    },
    {
      id: 'target-ref-30',
      category: 'referral',
      title: '20 - 30 Referrals Milestone (Tier 3)',
      description: 'Reach between 20 and 30 active referrals to claim the ultimate mega milestone bonus.',
      icon: 'military_tech',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      badgeText: 'Referral 20-30',
      targetCount: 30,
      currentCount: referralCount,
      unit: 'Friends',
      rewardBdt: 750,
      rewardUsd: 7.50,
      rewardCoins: 800,
      deadlineText: 'Season Milestone',
      actionButtonLabel: 'Share Referral Link',
      rules: [
        'Reach up to 30 total active referrals.',
        'Unlocks the elite $7.50 (৳750) cash prize and +800 coins.'
      ]
    },
    {
      id: 'target-recharge-5',
      category: 'recharge',
      title: '5 Mobile Recharges Milestone',
      description: 'Complete 5 mobile recharge top-ups on any operator through the Mobile Recharge section.',
      icon: 'phonelink_ring',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badgeText: 'Mobile Recharge',
      targetCount: 5,
      currentCount: rechargeCount,
      unit: 'Recharges',
      rewardBdt: 150,
      rewardUsd: 1.50,
      rewardCoins: 150,
      deadlineText: 'Rolling Monthly Goal',
      actionButtonLabel: 'Recharge Now',
      actionPageRoute: 'mobile-recharge',
      rules: [
        'Valid across all supported operators (GP, Banglalink, Robi, Airtel).',
        'Minimum top-up amount is ৳20 per transaction.',
        'Instant cashback bonus is claimable once 5 top-ups are successfully recorded.'
      ]
    },
    {
      id: 'target-namaj-30d',
      category: 'namaj',
      title: '1 Month Prayer Streak Bonus (30 Days)',
      description: 'Track and complete all 5 daily prayers for 30 consecutive days in the Namaj Pora tracker.',
      icon: 'mosque',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badgeText: 'Prayer Streak',
      targetCount: 30,
      currentCount: namajDaysStreak,
      unit: 'Days Streak',
      rewardBdt: 450,
      rewardUsd: 4.50,
      rewardCoins: 500,
      deadlineText: 'Continuous Rolling 30 Days',
      actionButtonLabel: 'Track Prayer Daily',
      rules: [
        'Log in daily to the Namaj Pora page and mark all 5 daily prayers.',
        'Maintain a continuous 30-day streak without interruption.',
        'Upon reaching 30 days, receive an extra $4.50 (৳450) cash reward and +500 free coins.'
      ]
    }
  ];

  const filteredTasks = targetTasks.filter((task) => {
    if (task.id === 'target-ref-10' && claimedBonuses['target-ref-10']) return false;
    if (task.id === 'target-ref-20' && (!claimedBonuses['target-ref-10'] || claimedBonuses['target-ref-20'])) return false;
    if (task.id === 'target-ref-30' && (!claimedBonuses['target-ref-20'] || claimedBonuses['target-ref-30'])) return false;

    if (activeFilter === 'all') return true;
    return task.category === activeFilter;
  });

  const handleClaim = (task: TargetBonusTask) => {
    if (claimedBonuses[task.id]) return;

    const updatedClaimed = { ...claimedBonuses, [task.id]: true };
    setClaimedBonuses(updatedClaimed);
    try {
      localStorage.setItem('microjobs_claimed_target_bonuses', JSON.stringify(updatedClaimed));
    } catch {
      // ignore
    }

    if (onClaimBonus) {
      onClaimBonus(task.id, task.rewardUsd, task.title);
    }

    setClaimSuccessModal({
      title: task.title,
      rewardBdt: task.rewardBdt,
      rewardUsd: task.rewardUsd,
      rewardCoins: task.rewardCoins
    });

    // Auto reset logic upon claim
    if (task.id === 'target-namaj-30d') {
      setNamajDaysStreak(0);
      try {
        localStorage.setItem('microjobs_namaj_streak_days', '0');
        const resetClaimed = { ...updatedClaimed, 'target-namaj-30d': false };
        setClaimedBonuses(resetClaimed);
        localStorage.setItem('microjobs_claimed_target_bonuses', JSON.stringify(resetClaimed));
      } catch {}
    } else if (task.id === 'target-recharge-5') {
      setRechargeCount(0);
      try {
        localStorage.setItem('microjobs_mobile_recharges', JSON.stringify([]));
        localStorage.removeItem('microjobs_recharge_requests');
        const resetClaimed = { ...updatedClaimed, 'target-recharge-5': false };
        setClaimedBonuses(resetClaimed);
        localStorage.setItem('microjobs_claimed_target_bonuses', JSON.stringify(resetClaimed));
      } catch {}
    } else if (task.id === 'target-ref-30') {
      // Once 20-30 referral tier is claimed, reset referral count and all referral claims to loop back to 1-10
      setReferralCount(0);
      try {
        localStorage.setItem('microjobs_referral_count', '0');
        const countsMapStr = localStorage.getItem('microjobs_referral_counts_map');
        if (countsMapStr && currentUser?.username) {
          const myUsername = currentUser.username.replace('@', '').toLowerCase();
          const countsMap = JSON.parse(countsMapStr);
          countsMap[myUsername] = 0;
          localStorage.setItem('microjobs_referral_counts_map', JSON.stringify(countsMap));
        }
        const resetClaimed = {
          ...updatedClaimed,
          'target-ref-10': false,
          'target-ref-20': false,
          'target-ref-30': false
        };
        setClaimedBonuses(resetClaimed);
        localStorage.setItem('microjobs_claimed_target_bonuses', JSON.stringify(resetClaimed));
      } catch {}
    }
  };



  return (
    <div className="w-full bg-[#FAFCFF] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP BREADCRUMB & BACK BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-600 transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
            >
              Find Jobs
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Target Bonus</span>
          </div>

          <button
            onClick={() => onNavigate('find-jobs')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Find Jobs</span>
          </button>
        </div>

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-10 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-20 -mb-10 w-48 h-48 rounded-full bg-yellow-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold shadow-xs">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>Milestone Rewards Program • High-Earning Bonus Goals</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
              Target Bonus Program
            </h1>

            <p className="text-xs sm:text-base text-amber-50 leading-relaxed max-w-2xl">
              Achieve specified targets to unlock exclusive cash bonuses! 
              Hit milestones in <strong>Referrals</strong>, <strong>Mobile Recharges</strong>, and 
              <strong> 1 Month Prayer Streak</strong> to claim instant wallet earnings.
            </p>

            {/* Quick Stats Badges */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-300 text-[26px]">workspace_premium</span>
                <div>
                  <div className="text-[11px] text-amber-100 font-medium">Max Milestone Bonus</div>
                  <div className="text-base sm:text-lg font-black text-white">$7.50 / ৳750</div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-300 text-[26px]">toll</span>
                <div>
                  <div className="text-[11px] text-amber-100 font-medium">Free Coin Rewards</div>
                  <div className="text-base sm:text-lg font-black text-white">+1,500 Coins</div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-300 text-[26px]">verified</span>
                <div>
                  <div className="text-[11px] text-amber-100 font-medium">Instant Wallet Payout</div>
                  <div className="text-base sm:text-lg font-black text-white">100% Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REFERRAL QUICK-INVITE BOX */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5">
                <span className="material-symbols-outlined text-[15px]">share</span>
                <span>Your Unique Referral Link</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Invite Friends to Reach Referral Milestones
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each verified registration counts towards your 10-friend and 25-friend Target Bonuses.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700">
                Code: {referralCode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-50 p-2 sm:p-3 rounded-2xl border border-slate-200">
            <div className="flex-1 flex items-center px-3 gap-2 overflow-hidden text-xs sm:text-sm font-mono text-slate-700 select-all">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">link</span>
              <span className="truncate">{referralLink}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy Link</span>
            </button>
          </div>

          {copyToast && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>{copyToast}</span>
            </div>
          )}
        </div>

        {/* FILTER CATEGORY PILLS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-500 mr-1">Filter Goals:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Targets ({targetTasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('referral')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'referral'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">group_add</span>
            <span>Referrals</span>
          </button>
          <button
            onClick={() => setActiveFilter('recharge')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'recharge'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">phonelink_ring</span>
            <span>Mobile Recharge</span>
          </button>
          <button
            onClick={() => setActiveFilter('namaj')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'namaj'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">mosque</span>
            <span>1 Month Prayer Streak</span>
          </button>
        </div>

        {/* TARGET BONUS TASK CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const isCompleted = task.currentCount >= task.targetCount;
            const isClaimed = isCompleted && !!claimedBonuses[task.id];
            const progressPercent = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));

            return (
              <div
                key={task.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isClaimed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isCompleted
                    ? 'border-amber-300 ring-2 ring-amber-300/40'
                    : 'border-slate-100'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${task.iconBg} ${task.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                        <span className="material-symbols-outlined text-[26px]">{task.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {task.badgeText}
                          </span>
                          {isClaimed && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">check</span>
                              Claimed
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-slate-900 text-base sm:text-lg mt-1">
                          {task.title}
                        </h3>
                      </div>
                    </div>

                    {/* Reward Badge */}
                    <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-slate-100">
                      <div className="text-xs text-slate-500 font-medium">Bonus Reward</div>
                      <div className="text-lg font-black text-emerald-600">
                        ${task.rewardUsd.toFixed(2)} <span className="text-xs text-slate-400 font-semibold">(৳{task.rewardBdt})</span>
                      </div>
                      <div className="text-[11px] text-amber-600 font-bold flex items-center justify-start sm:justify-end gap-1">
                        <span className="material-symbols-outlined text-[13px]">toll</span>
                        +{task.rewardCoins} Coins
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {task.description}
                  </p>

                  {/* PROGRESS BAR & COUNTER */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Progress:</span>
                      <span className={isCompleted ? 'text-emerald-600' : 'text-blue-600'}>
                        {task.currentCount} / {task.targetCount} {task.unit} ({progressPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>{task.deadlineText}</span>
                      {isCompleted ? (
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">task_alt</span>
                          Target Achieved!
                        </span>
                      ) : (
                        <span>{Math.max(0, task.targetCount - task.currentCount)} {task.unit} remaining</span>
                      )}
                    </div>
                  </div>

                  {/* Rules / Steps */}
                  <div className="space-y-1 mb-5">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Rules & Requirements:
                    </div>
                    {task.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-500">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">


                  <div className="w-full sm:w-auto flex items-center gap-2 ml-auto">
                    {task.actionPageRoute && !isCompleted && !isClaimed && (
                      <button
                        onClick={() => onNavigate(task.actionPageRoute!)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>{task.actionButtonLabel}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}

                    {task.category === 'referral' && !isCompleted && !isClaimed && (
                      <button
                        onClick={handleCopyLink}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        <span>Copy Link</span>
                      </button>
                    )}

                    {/* Claim Button */}
                    {isClaimed ? (
                      <button
                        disabled
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Reward Claimed</span>
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClaim(task)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <span className="material-symbols-outlined text-[16px]">redeem</span>
                        <span>Claim ${task.rewardUsd.toFixed(2)} Bonus!</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Locked until Target Reached</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HOW TARGET BONUS WORKS EXPLAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">help</span>
              <span>How Target Bonus Works</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Earn Big in 3 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Boost your daily micro-job income by unlocking guaranteed milestone bonuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-black text-lg">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">1. Choose a Goal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your preferred milestone: Referral invitations, Mobile Recharges, or the 30-Day Prayer Streak.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-black text-lg">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">2. Complete the Target</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Invite friends with your link, execute mobile recharges, or track your prayers consistently each day.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-black text-lg">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">3. Claim Instant Cash</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once unlocked, click &lsquo;Claim Bonus&rsquo; to instantly deposit money and bonus coins into your main wallet.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CLAIM SUCCESS MODAL */}
      {claimSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[36px]">celebration</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Congratulations! Target Bonus Claimed! 🎉
              </h3>
              <p className="text-xs text-slate-500">
                Your reward for completing {claimSuccessModal.title} has been added to your wallet.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
              <div className="text-xs text-emerald-800 font-bold">Reward Credited:</div>
              <div className="text-2xl font-black text-emerald-700">
                +${claimSuccessModal.rewardUsd.toFixed(2)} <span className="text-sm">(৳{claimSuccessModal.rewardBdt})</span>
              </div>
              <div className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[15px]">toll</span>
                +{claimSuccessModal.rewardCoins} Free Coins
              </div>
            </div>

            <button
              onClick={() => setClaimSuccessModal(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Great, Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

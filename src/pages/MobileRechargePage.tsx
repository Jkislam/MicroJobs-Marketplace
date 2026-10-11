import React, { useState } from 'react';
import { PageType, UserProfileData, MobileRechargeRequest } from '../types';

interface MobileRechargePageProps {
  onNavigate: (page: PageType) => void;
  currentUser?: UserProfileData;
  onRechargeSuccess?: (request: MobileRechargeRequest) => void;
}

interface OperatorInfo {
  id: 'Grameenphone' | 'Banglalink' | 'Robi' | 'Airtel';
  name: string;
  tagline: string;
  prefixes: string[];
  gradient: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  logoLetter: string;
}

const OPERATORS: OperatorInfo[] = [
  {
    id: 'Grameenphone',
    name: 'Grameenphone',
    tagline: 'Stay Close',
    prefixes: ['017', '013'],
    gradient: 'from-sky-500 to-blue-600',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeBorder: 'border-sky-500',
    logoLetter: 'GP'
  },
  {
    id: 'Banglalink',
    name: 'Banglalink',
    tagline: 'Digital Experience',
    prefixes: ['019', '014'],
    gradient: 'from-amber-500 to-orange-600',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeBorder: 'border-orange-500',
    logoLetter: 'BL'
  },
  {
    id: 'Robi',
    name: 'Robi',
    tagline: 'Ignite the Power',
    prefixes: ['018'],
    gradient: 'from-rose-500 to-red-600',
    accentColor: '#e11d48',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBorder: 'border-rose-500',
    logoLetter: 'Robi'
  },
  {
    id: 'Airtel',
    name: 'Airtel',
    tagline: 'The Smartphone Network',
    prefixes: ['016'],
    gradient: 'from-red-600 to-pink-600',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    badgeBorder: 'border-red-500',
    logoLetter: 'Air'
  }
];

const PRESET_AMOUNTS = [
  { value: 20, tag: 'Min' },
  { value: 50, tag: 'Popular' },
  { value: 100, tag: 'Best Value' },
  { value: 200, tag: '' },
  { value: 500, tag: '' },
  { value: 1000, tag: 'Max' }
];

export const MobileRechargePage: React.FC<MobileRechargePageProps> = ({
  onNavigate,
  currentUser,
  onRechargeSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<OperatorInfo['id']>('Grameenphone');
  const [amount, setAmount] = useState<number | string>(50);
  const [paymentSource, setPaymentSource] = useState<'balance' | 'coins'>('balance');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<MobileRechargeRequest | null>(null);

  // Coins balance loaded from local storage
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microjobs_coins') || localStorage.getItem('microjobs_quran_coins');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Past recharge requests history
  const [rechargeHistory, setRechargeHistory] = useState<MobileRechargeRequest[]>(() => {
    try {
      const saved = localStorage.getItem('microjobs_mobile_recharges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Exchange rate: 1 USD = 110 BDT
  const BDT_PER_USD = 110;
  const earningsUSD = currentUser?.totalEarnings ?? 0;
  const earningsBDT = earningsUSD * BDT_PER_USD;

  // Auto-detect operator based on phone prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 11) {
      setPhoneNumber(val);
      if (val.length >= 3) {
        const prefix = val.substring(0, 3);
        const match = OPERATORS.find((op) => op.prefixes.includes(prefix));
        if (match) {
          setSelectedOperator(match.id);
        }
      }
    }
  };

  const currentOp = OPERATORS.find((op) => op.id === selectedOperator) || OPERATORS[0];
  const numAmount = Number(amount) || 0;
  const coinsRequired = numAmount * 10;
  const usdRequired = numAmount / BDT_PER_USD;

  const isBalanceSufficient = earningsBDT >= numAmount;
  const isCoinsSufficient = coins >= coinsRequired;

  const handleRepeatRecharge = (prev: MobileRechargeRequest) => {
    setPhoneNumber(prev.phoneNumber);
    setSelectedOperator(prev.operator);
    setAmount(prev.amount);
    setPaymentSource(prev.paymentSource);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneNumber.trim();
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number starting with 01 (e.g., 017XXXXXXXX).');
      return;
    }

    if (numAmount < 20) {
      setErrorMsg('Minimum recharge amount is ৳20 BDT.');
      return;
    }

    if (numAmount > 1000) {
      setErrorMsg('Maximum recharge amount per transaction is ৳1,000 BDT.');
      return;
    }

    if (paymentSource === 'balance' && !isBalanceSufficient) {
      setErrorMsg(`Insufficient Account Balance! You have ৳${earningsBDT.toFixed(1)} BDT ($${earningsUSD.toFixed(2)} USD), but ৳${numAmount} BDT ($${usdRequired.toFixed(2)} USD) is required.`);
      return;
    }

    if (paymentSource === 'coins' && !isCoinsSufficient) {
      setErrorMsg(`Insufficient Coins! You need ${coinsRequired} coins for ৳${numAmount} BDT top-up (Current balance: ${coins} coins).`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRequest: MobileRechargeRequest = {
        id: `RCH-${Math.floor(100000 + Math.random() * 900000)}`,
        phoneNumber: cleanPhone,
        operator: selectedOperator,
        amount: numAmount,
        paymentSource,
        coinsUsed: paymentSource === 'coins' ? coinsRequired : 0,
        status: 'pending',
        requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        userEmail: currentUser?.email || 'user@example.com',
        userName: currentUser?.fullName || 'User',
        note: note.trim() || undefined
      };

      // Deduct coins if paid by coins
      if (paymentSource === 'coins') {
        const remainingCoins = Math.max(0, coins - coinsRequired);
        setCoins(remainingCoins);
        try {
          localStorage.setItem('microjobs_coins', String(remainingCoins));
          localStorage.setItem('microjobs_quran_coins', String(remainingCoins));
        } catch {
          // ignore
        }
      }

      // Update history in state and localStorage
      const updatedList = [newRequest, ...rechargeHistory];
      setRechargeHistory(updatedList);
      try {
        localStorage.setItem('microjobs_mobile_recharges', JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Could not save recharge history:', err);
      }

      if (onRechargeSuccess) {
        onRechargeSuccess(newRequest);
      }

      setIsSubmitting(false);
      setShowReceiptModal(newRequest);
      setPhoneNumber('');
      setNote('');
    }, 700);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Live Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('find-jobs')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer self-start"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Find Jobs</span>
          </button>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Instant Automated Top-Up • 24/7 Available</span>
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <span className="material-symbols-outlined text-3xl">phonelink_ring</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Instant Mobile Recharge
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Fast, secure mobile top-up for all Bangladeshi networks. Pay effortlessly using your account earnings or redeem your earned task coins.
          </p>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Main Account Balance Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Account Earnings Wallet
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-numeric-stat">
                  ${earningsUSD.toFixed(2)} <span className="text-sm font-bold text-slate-500">USD</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <span>≈ ৳{earningsBDT.toFixed(0)} BDT</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Rate: $1 = ৳110</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
            </div>
          </div>

          {/* Coins Balance Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Task & Prayer Coins Wallet
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 font-numeric-stat flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-2xl sm:text-3xl">toll</span>
                  <span>{coins.toLocaleString()}</span>
                  <span className="text-sm font-bold text-amber-700">Coins</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <span>10 Coins = ৳1 BDT Top-Up</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ≈ ৳{(coins / 10).toFixed(0)} BDT Value
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60 shadow-2xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">stars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in">
            <span className="material-symbols-outlined text-rose-600 text-xl shrink-0">error</span>
            <p className="flex-1">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* MAIN WORKFLOW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7-COLS: Recharge Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">send_to_mobile</span>
                  <span>Top-Up Request Form</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your recipient number, select network provider and desired amount.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                BD Mobile
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Mobile Number with Prefix Detection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-slate-200 pr-2.5 text-slate-500 text-xs font-bold select-none">
                    <span className="text-base">🇧🇩</span>
                    <span>+880</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="017XXXXXXXX"
                    maxLength={11}
                    required
                    className="w-full pl-24 pr-24 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm sm:text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {phoneNumber.length >= 3 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${currentOp.gradient}`}>
                        {currentOp.name}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-400">
                      {phoneNumber.length}/11
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-0.5">
                  <span>Supported: GP, Robi, Banglalink, Airtel</span>
                  {phoneNumber.length > 0 && phoneNumber.length < 11 && (
                    <span className="text-amber-600 font-medium">Enter 11 digits</span>
                  )}
                  {phoneNumber.length === 11 && (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">check_circle</span> Valid Format
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Operator Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">
                  Select Telecom Operator <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {OPERATORS.map((op) => {
                    const isSelected = selectedOperator === op.id;
                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setSelectedOperator(op.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${op.gradient} text-white font-black text-xs flex items-center justify-center shadow-xs`}
                        >
                          {op.logoLetter}
                        </div>
                        <span className="text-xs font-bold text-slate-900 block truncate w-full">
                          {op.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {op.prefixes.join(', ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Amount Selection with Quick Preset Pills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Recharge Amount (BDT) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Min ৳20 • Max ৳1,000</span>
                </div>

                <div className="relative max-w-xs mb-3">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                    ৳
                  </div>
                  <input
                    type="number"
                    min={20}
                    max={1000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50"
                    required
                    className="w-full pl-9 pr-14 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-numeric-stat"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    BDT
                  </div>
                </div>

                {/* Denomination Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Select:</span>
                  {PRESET_AMOUNTS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setAmount(item.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        Number(amount) === item.value
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>৳{item.value}</span>
                      {item.tag && (
                        <span className={`text-[9px] px-1 rounded font-normal ${
                          Number(amount) === item.value
                            ? 'bg-emerald-700 text-emerald-100'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.tag}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Account Balance Option */}
                  <div
                    onClick={() => setPaymentSource('balance')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                      paymentSource === 'balance'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      {paymentSource === 'balance' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        Account Earnings Wallet
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Deducts from your earned USD balance
                      </span>
                      <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60 inline-block">
                        Available: ৳{earningsBDT.toFixed(0)} BDT
                      </div>
                    </div>
                  </div>

                  {/* Task Coins Option */}
                  <div
                    onClick={() => setPaymentSource('coins')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                      paymentSource === 'coins'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      {paymentSource === 'coins' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-amber-950 block flex items-center gap-1.5">
                        <span>Task & Prayer Coins</span>
                        <span className="material-symbols-outlined text-amber-600 text-[16px]">toll</span>
                      </span>
                      <span className="text-[11px] text-amber-800/80 block mt-0.5">
                        10 Coins = ৳1 BDT (Requires {coinsRequired} coins)
                      </span>
                      <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-200/60 inline-block">
                        Available: {coins} Coins
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Optional Note */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Optional Note / Reference
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Specific minute pack or bundle request..."
                  className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      <span>Processing Recharge Request...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">bolt</span>
                      <span>Confirm & Send Recharge (৳{numAmount})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT 5-COLS: Live Order Summary & Instructions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-600">receipt</span>
                  <span>Order Summary</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Recipient Number</span>
                  <span className="font-bold text-slate-900 font-numeric-stat">
                    {phoneNumber ? `+880 ${phoneNumber}` : 'Not entered yet'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Network Operator</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentOp.gradient}`}></span>
                    <span className="font-bold text-slate-900">{currentOp.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Top-Up Amount</span>
                  <span className="font-black text-slate-900 text-sm font-numeric-stat">
                    ৳{numAmount} BDT
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Payment Channel</span>
                  <span className="font-bold text-slate-900">
                    {paymentSource === 'balance' ? 'Earnings Balance' : 'Coins Wallet'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Deduction Cost</span>
                  <span className="font-bold text-slate-900">
                    {paymentSource === 'balance'
                      ? `$${usdRequired.toFixed(2)} USD (৳${numAmount})`
                      : `${coinsRequired} Coins`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-medium">Processing Time</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">speed</span> Instant (1 - 3 mins)
                  </span>
                </div>
              </div>

              {/* Total Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-300 block">Total Recharge</span>
                  <span className="text-xl font-black font-numeric-stat">৳{numAmount} BDT</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Ready
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
                <span>100% Guaranteed delivery or balance refunded immediately.</span>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600">help_outline</span>
                <span>How Recharge Works</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                  <p>Type any Bangladeshi mobile number (GP, BL, Robi, Airtel).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                  <p>Select your recharge amount (৳20 to ৳1,000).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                  <p>Pay with task earnings or exchange 10 prayer/task coins for ৳1 BDT.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] flex items-center justify-center shrink-0">4</span>
                  <p>Our automated gateway dispatches your top-up instantly to the receiver.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RECENT RECHARGE HISTORY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">history</span>
                <span>Recent Recharge Transactions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record of all your processed and pending mobile top-ups
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold self-start sm:self-auto">
              Total {rechargeHistory.length} Records
            </span>
          </div>

          {rechargeHistory.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {rechargeHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <span className="material-symbols-outlined text-2xl">phonelink_ring</span>
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                        <span className="font-numeric-stat">{item.phoneNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {item.operator}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-mono">Ref: {item.id}</span>
                        <span>•</span>
                        <span>{item.requestedAt}</span>
                        {item.paymentSource === 'coins' ? (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-amber-600">toll</span>
                              <span>{item.coinsUsed} Coins Redeemed</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span>•</span>
                            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              Account Earnings
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-base font-numeric-stat block">
                        ৳{item.amount}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">BDT</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'failed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.status === 'completed' ? 'Completed' : item.status === 'failed' ? 'Failed' : 'Processing'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRepeatRecharge(item)}
                      title="Repeat Recharge"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">replay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <p className="text-xs font-bold text-slate-700">No recharge history found yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Enter your mobile number and send your first top-up request using the form above.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* SUCCESS CONFIRMATION RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Recharge Request Sent!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your top-up of <span className="font-bold text-slate-900">৳{showReceiptModal.amount} BDT</span> has been queued for instant delivery.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{showReceiptModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-bold text-slate-900 font-numeric-stat">{showReceiptModal.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operator:</span>
                <span className="font-bold text-slate-900">{showReceiptModal.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold text-slate-900">
                  {showReceiptModal.paymentSource === 'coins'
                    ? `${showReceiptModal.coinsUsed} Coins`
                    : 'Account Earnings'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-600">1 - 3 Minutes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReceiptModal(null)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done / Recharge Another Number
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

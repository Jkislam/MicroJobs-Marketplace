import React, { useState } from 'react';
import { PageType } from '../types';

interface TelegramSellPageProps {
  onNavigate: (page: PageType) => void;
  onSubmitTelegram?: (
    phone: string,
    username: string,
    twoStepPassword: string,
    accountType: string,
    channelLink: string,
    otpContact: string,
    note?: string
  ) => void;
}

export const TelegramSellPage: React.FC<TelegramSellPageProps> = ({
  onNavigate,
  onSubmitTelegram
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [twoStepPasswordInput, setTwoStepPasswordInput] = useState('');
  const [accountType, setAccountType] = useState('Personal Old Account (1-2+ Months)');
  const [channelLinkInput, setChannelLinkInput] = useState('');
  const [otpContactInput, setOtpContactInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [submittedList, setSubmittedList] = useState<
    { phone: string; username: string; type: string; time: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneInput.trim()) {
      alert('অনুগ্রহ করে টেলিগ্রাম ফোন নম্বরটি সঠিক কান্ট্রি কোড সহ দিন। (Please enter Telegram phone number)');
      return;
    }

    if (!otpContactInput.trim()) {
      alert('এডমিন লগইন করার সময় OTP কোড পাঠানোর মাধ্যম (WhatsApp নম্বর বা কল) উল্লেখ করুন।');
      return;
    }

    if (!termsAgreed) {
      alert('দয়া করে শর্তাবলী মেনে চলার টিকচিহ্নটি দিন। (Please agree to Telegram selling terms)');
      return;
    }

    if (onSubmitTelegram) {
      onSubmitTelegram(
        phoneInput.trim(),
        usernameInput.trim(),
        twoStepPasswordInput.trim(),
        accountType,
        channelLinkInput.trim(),
        otpContactInput.trim(),
        noteInput.trim()
      );
    }

    setSubmittedList((prev) => [
      {
        phone: phoneInput.trim(),
        username: usernameInput.trim() ? `@${usernameInput.trim().replace(/^@/, '')}` : 'N/A',
        type: accountType,
        time: 'Just now'
      },
      ...prev
    ]);

    setPhoneInput('');
    setUsernameInput('');
    setTwoStepPasswordInput('');
    setChannelLinkInput('');
    setOtpContactInput('');
    setNoteInput('');
    setTermsAgreed(false);

    alert('টেলিগ্রাম একাউন্টের তথ্য সফলভাবে জমা হয়েছে! এডমিন শীঘ্রই আপনার দেওয়া নম্বরে যোগাযোগ করে লগইন ও ভেরিফিকেশন সম্পন্ন করবেন এবং একাউন্টে টাকা যোগ হবে।');
  };

  return (
    <div className="w-full bg-slate-50/50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* TOP NAVIGATION & HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <button
            onClick={() => onNavigate('find-jobs')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs cursor-pointer w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Categories (ক্যাটেগরিতে ফিরে যান)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-bold text-xs flex items-center gap-1.5 border border-sky-200/60">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.832.941z"/>
              </svg>
              <span>Telegram Sell Category</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-numeric-stat">
              ৳80.00 / $0.80 Per Account
            </span>
          </div>
        </div>

        {/* HIGHLIGHTED BENGALI INSTRUCTION NOTICE BANNER AT TOP */}
        <div className="bg-amber-500/10 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-900 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-amber-900 flex items-center gap-1.5 font-display">
              <span>বিশেষ নির্দেশনা (Important Notice):</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
              টেলিগ্রাম সেল দেওয়ার পূর্বে নিয়মাবলী ভালোভাবে পড়ুন। একাউন্টে টু-স্টেপ ভেরিফিকেশন ক্লাউড পাসওয়ার্ড (Two-Step Cloud Password) দেয়া থাকলে তা নির্ভুলভাবে সাবমিট করতে হবে এবং একাউন্টটি স্প্যামবট রেস্ট্রিকশন মুক্ত হতে হবে। এডমিন লগইনের সময় ওটিপি কোড দিয়ে সহায়তা করতে হবে।
            </p>
          </div>
        </div>

        {/* HERO TITLE BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Fast Verification Task</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Telegram Sell Task (টেলিগ্রাম আইডি ও চ্যানেল সেল)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              আপনার পুরানো টেলিগ্রাম একাউন্ট বা চ্যানেল বিক্রি করে সরাসরি ক্যাশ আয় করুন। সঠিক মোবাইল নম্বর ও ক্লাউড পাসওয়ার্ড সাবমিট করুন এবং প্রতিটি একাউন্টে ৳৮০ থেকে ৳৩৫০ পর্যন্ত পান।
            </p>
          </div>
        </div>

        {/* TERMS & CONDITIONS CARD (শর্তাবলী) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-sky-600 text-[22px]">gavel</span>
              <span>টেলিগ্রাম সেল দেওয়ার প্রয়োজনীয় শর্তাবলী (Required Conditions)</span>
            </h2>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              বাধ্যতামূলক শর্তসমূহ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Condition 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>১. একাউন্টের বয়স (Account Age)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                টেলিগ্রাম একাউন্টটি নূন্যতম <strong>১ থেকে ২ মাস পুরানো</strong> ও সচল হতে হবে। সদ্য তৈরি নতুন ব্যান হওয়ার ঝুঁকিপূর্ণ একাউন্ট গ্রহণ করা হবে না।
              </p>
            </div>

            {/* Condition 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>২. স্প্যামবট ফ্রি চেক (@SpamBot Clean)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                টেলিগ্রামের <strong>@SpamBot</strong> এ মেসেজ দিয়ে নিশ্চিত করুন যে একাউন্ট সম্পূর্ণ রেস্ট্রিকশন মুক্ত এবং কোনো রিপোর্ট নেই।
              </p>
            </div>

            {/* Condition 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">password</span>
                <span>৩. টু-স্টেপ পাসওয়ার্ড (Two-Step Password)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                যদি একাউন্টে টু-স্টেপ ক্লাউড পাসওয়ার্ড সেট করা থাকে, তবে সেই <strong>পাসওয়ার্ডটি নির্ভুলভাবে</strong> বক্সে দিতে হবে।
              </p>
            </div>

            {/* Condition 4 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">phonelink_ring</span>
                <span>৪. সচল নম্বর ও ওটিপি (Active OTP)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                যে নম্বর দিয়ে টেলিগ্রাম খোলা, এডমিন লগইনের সময় সেই নম্বরে যাওয়া <strong>লগইন কোড (OTP)</strong> প্রদান করার জন্য প্রস্তুত থাকতে হবে।
              </p>
            </div>

            {/* Condition 5 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                <span>৫. চ্যানেল/গ্রুপ শর্ত (Channel / Group)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                চ্যানেল বা গ্রুপ বিক্রি করলে চ্যানেলের সম্পূর্ণ <strong>মালিকানা (Transfer Ownership)</strong> এডমিনকে দিতে হবে।
              </p>
            </div>

            {/* Condition 6 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">devices</span>
                <span>৬. ডিভাইস সেশন সমাপ্তি (Terminate Session)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                এডমিন লগইন নিশ্চিত করার পর আপনার ডিভাইস সেটিংস থেকে আগের <strong>সেশনটি ক্লোজ বা লগআউট</strong> করতে হবে।
              </p>
            </div>
          </div>
        </div>

        {/* SUBMISSION FORM CARD (এডমিনকে যে সকল তথ্য দিতে হবে) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-1.5">
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>এডমিন প্যানেলে তথ্য জমা ফরম</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span>Telegram Account Submission Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              এডমিনকে যাচাই করার জন্য নিচের সকল তথ্য সঠিকভাবে পূরণ করে সাবমিট করুন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telegram Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  টেলিগ্রাম ফোন নম্বর (Telegram Phone with Country Code) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    phone
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Telegram Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  টেলিগ্রাম ইউজারনেম (Telegram Username)
                </label>
                <div className="relative">
                  <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="your_tg_handle"
                    className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Two-step Verification Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  টু-স্টেপ ভেরিফিকেশন পাসওয়ার্ড (Two-Step Cloud Password)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    password
                  </span>
                  <input
                    type="text"
                    value={twoStepPasswordInput}
                    onChange={(e) => setTwoStepPasswordInput(e.target.value)}
                    placeholder="সেট করা থাকলে পাসওয়ার্ড লিখুন (না থাকলে খালি রাখুন)"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  একাউন্টের ধরন (Account Type) <span className="text-red-500">*</span>
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold cursor-pointer"
                >
                  <option value="Personal Old Account (1-2+ Months)">ব্যক্তিগত পুরানো একাউন্ট (১-২ মাস পুরানো) - ৳৮০</option>
                  <option value="Aged Account (6+ Months / 1 Year)">খুব পুরানো একাউন্ট (৬ মাস - ১ বছর) - ৳১২০</option>
                  <option value="Channel / Group (500+ Members)">টেলিগ্রাম চ্যানেল বা গ্রুপ (৫০০+ মেম্বার) - ৳১৫০+</option>
                  <option value="Virtual / US Number Account">ভার্চুয়াল বা ইউএস নম্বর একাউন্ট - ৳১০০</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp or OTP contact */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  ওটিপি (OTP) দেওয়ার জন্য যোগাযোগ নম্বর (WhatsApp/Mobile) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    chat
                  </span>
                  <input
                    type="text"
                    required
                    value={otpContactInput}
                    onChange={(e) => setOtpContactInput(e.target.value)}
                    placeholder="WhatsApp: +88017... অথবা ফোন নম্বর"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Channel / Group Link (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  চ্যানেল বা গ্রুপ লিঙ্ক (যদি চ্যানেল সেল দেন)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    link
                  </span>
                  <input
                    type="text"
                    value={channelLinkInput}
                    onChange={(e) => setChannelLinkInput(e.target.value)}
                    placeholder="https://t.me/your_channel_name"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Note / Additional info */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                অতিরিক্ত নোট বা তথ্য (Additional Note)
              </label>
              <textarea
                rows={2}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="একাউন্টের বয়স, মেম্বার সংখ্যা বা কোনো বিশেষ তথ্য থাকলে লিখুন..."
                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all"
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms-check-tg"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <label htmlFor="terms-check-tg" className="text-xs text-slate-700 font-medium cursor-pointer leading-relaxed">
                আমি স্বীকার করছি যে একাউন্টটি স্প্যামবট রেস্ট্রিকশন মুক্ত, সচল এবং এডমিন লগইন করার সময় আমি ওটিপি দিয়ে সহায়তা করব এবং পরবর্তীতে ডিভাইস থেকে সেশন ক্লোজ করব।
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Submit Telegram Account (এডমিনের কাছে জমা দিন)</span>
            </button>
          </form>

          {/* Recently Submitted Accounts List */}
          {submittedList.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Recently Submitted Accounts:</h4>
              <div className="space-y-1.5">
                {submittedList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                        check_circle
                      </span>
                      <span className="font-bold text-slate-800">{item.phone}</span>
                      <span className="text-slate-400 text-[11px]">({item.username})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Pending Review (৳৮০)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP-BY-STEP INSTRUCTIONS SECTION */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-amber-500 text-[22px]">menu_book</span>
              <span>Detailed Guidelines & Instructions (ধাপ অনুযায়ী নির্দেশনাবলী)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STEP 1 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-extrabold text-sm">
                ১
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                ১. একাউন্ট স্প্যামবট চেক (Check SpamBot)
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>টেলিগ্রাম সার্চে গিয়ে <strong>@SpamBot</strong> লিখে স্টার্ট দিন।</li>
                <li>নিশ্চিত করুন মেসেজে "Good news, no limits" লেখা রয়েছে।</li>
                <li>যদি Two-Step Verification চালু থাকে তবে পাসওয়ার্ডটি মনে রাখুন বা নোট করুন।</li>
                <li>সিম নম্বরটি যেন সচল থাকে যাতে ওটিপি কোড পাওয়া যায়।</li>
              </ul>
            </div>

            {/* STEP 2 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-sm">
                ২
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                ২. তথ্য সাবমিট করুন (Submit to Admin)
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>ফর্মটিতে আপনার টেলিগ্রাম ফোন নম্বরটি কান্ট্রি কোড সহ লিখুন।</li>
                <li>ইউজারনেম এবং টু-স্টেপ পাসওয়ার্ড (যদি থাকে) নির্ভুলভাবে দিন।</li>
                <li>ওটিপি যোগাযোগের জন্য আপনার WhatsApp নম্বর বা যোগাযোগ তথ্য দিন।</li>
                <li><strong>"Submit Telegram Account"</strong> বাটনে ক্লিক করুন।</li>
              </ul>
            </div>

            {/* STEP 3 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
                ৩
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                ৩. ওটিপি কনফার্মেশন ও পেমেন্ট (OTP & Payout)
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>এডমিন তথ্য দেখে লগইন করবেন এবং আপনার নম্বরে ওটিপি কোড যাবে।</li>
                <li>ওটিপি দেওয়ার সাথে সাথে এডমিন একাউন্ট অ্যাপ্রুভ করবেন।</li>
                <li>আপনার ওয়ালেটে নির্ধারিত টাকা (৳৮০ - ৳৩৫০) তাৎক্ষণিক জমা হবে।</li>
                <li>এরপর Settings &gt; Devices এ গিয়ে আগের সেশন সমাপ্ত করে দিন।</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

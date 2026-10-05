import React, { useState, useEffect } from 'react';
import { PageType } from '../types';

interface GmailSellPageProps {
  onNavigate: (page: PageType) => void;
  onSubmitGmail?: (gmail: string, pass: string, fname: string, lname: string, note?: string) => void;
}

const FIRST_NAMES = [
  'Sumon', 'Tanvir', 'Arman', 'Sakib', 'Naim', 'Fahim', 'Rakib', 'Sabbir',
  'Jewel', 'Arif', 'Biplob', 'Robin', 'Sohel', 'Mahfuz', 'Imran', 'Alamin',
  'Ruhul', 'Habib', 'Nahid', 'Jahid', 'Tariq', 'Zahid', 'Shanto', 'Rony',
  'Mamun', 'Parvez', 'Shamim', 'Anik', 'Sajjad', 'Rubel', 'Hasib', 'Faysal',
  'Mehedi', 'Riyad', 'Siam', 'Noyon', 'Saiful', 'Kamrul', 'Belal', 'Asif'
];

const LAST_NAMES = [
  'Hasan', 'Ahmed', 'Islam', 'Chowdhury', 'Hossain', 'Rahman', 'Khan', 'Sheikh',
  'Talukder', 'Sarkar', 'Ali', 'Kazi', 'Mia', 'Mahmud', 'Siddique', 'Haque',
  'Alam', 'Karim', 'Uddin', 'Akbar', 'Sikder', 'Zaman', 'Rana', 'Munshi',
  'Mollah', 'Bepari', 'Miah', 'Pramanik', 'Dewan', 'Bhuiyan', 'Howlader'
];

// Helper to generate unique random First Name, Last Name and Password
const generateUniqueParams = (usedSet: Set<string>) => {
  let attempts = 0;
  while (attempts < 500) {
    const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const passSymbols = ['#', '@', '$', '!'];
    const sym = passSymbols[Math.floor(Math.random() * passSymbols.length)];
    const pass = `MicroJobs${sym}${randNum}`;
    const comboKey = `${fn}-${ln}-${pass}`;

    if (!usedSet.has(comboKey)) {
      usedSet.add(comboKey);
      return { fname: fn, lname: ln, pass };
    }
    attempts++;
  }
  // Fallback timestamp unique generator
  const uniqueTs = Date.now().toString().slice(-4);
  const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const pass = `MicroJobs@${uniqueTs}`;
  return { fname: fn, lname: ln, pass };
};

export const GmailSellPage: React.FC<GmailSellPageProps> = ({ onNavigate, onSubmitGmail }) => {
  const [gmailInput, setGmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submittedList, setSubmittedList] = useState<{ gmail: string; pass: string; time: string }[]>([]);

  // Persistent tracked set of used name/password combinations
  const [usedSet] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem('microjobs_used_gmail_combos');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
    return new Set();
  });

  // Current active required parameters for the user
  const [requiredParams, setRequiredParams] = useState(() => generateUniqueParams(usedSet));

  // Save used combinations to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('microjobs_used_gmail_combos', JSON.stringify(Array.from(usedSet)));
  }, [usedSet, requiredParams]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleRandomizeParams = () => {
    const newParams = generateUniqueParams(usedSet);
    setRequiredParams(newParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailInput.trim() || !passwordInput.trim()) {
      alert('Please enter both the created Gmail address and password.');
      return;
    }

    if (!gmailInput.toLowerCase().includes('@gmail.com')) {
      alert('Please enter a valid Gmail address (e.g., example@gmail.com).');
      return;
    }

    if (onSubmitGmail) {
      onSubmitGmail(gmailInput.trim(), passwordInput.trim(), requiredParams.fname, requiredParams.lname, noteInput.trim());
    }

    setSubmittedList((prev) => [
      { gmail: gmailInput.trim(), pass: passwordInput.trim(), time: 'Just now' },
      ...prev
    ]);

    setGmailInput('');
    setPasswordInput('');
    setNoteInput('');

    // AUTOMATICALLY GENERATE A NEW RANDOM UNIQUE REQUIRED NAME & PASSWORD AFTER SUBMISSION
    const nextParams = generateUniqueParams(usedSet);
    setRequiredParams(nextParams);

    alert('Gmail account submitted successfully! New unique Name & Password generated below for your next account.');
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
            <span>Back to Categories</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Gmail Sell Category</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-numeric-stat">
              ৳50.00 / $0.50 Per Account
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
              জিমেইল তৈরির পূর্বে নির্দেশনা ভালোভাবে পড়ুন এবং সাবমিটের পর মোবাইল থেকে জিমেইল রিমুভ না করলে পেমেন্ট পাবেন না।
            </p>
          </div>
        </div>

        {/* HERO TITLE BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/30">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Instant Acceptance Task</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Gmail Sell Task
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Create a fresh Gmail account using the required unique details below, submit it here, and earn ৳50 ($0.50) per verified account.
            </p>
          </div>
        </div>

        {/* REQUIRED CREATION PARAMETERS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">badge</span>
                <span>Required Name & Password to Use for Gmail Creation</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically changes to a new unique random combination after each submission.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRandomizeParams}
                className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Generate New Unique Name & Password"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                <span>Randomize New</span>
              </button>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                Unique Auto-Generated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Name */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase">First Name</span>
                <span className="text-sm font-extrabold text-slate-800 font-numeric-stat">{requiredParams.fname}</span>
              </div>
              <button
                onClick={() => copyToClipboard(requiredParams.fname, 'fname')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copiedField === 'fname' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Last Name */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase">Last Name</span>
                <span className="text-sm font-extrabold text-slate-800 font-numeric-stat">{requiredParams.lname}</span>
              </div>
              <button
                onClick={() => copyToClipboard(requiredParams.lname, 'lname')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copiedField === 'lname' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Required Password */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase">Account Password</span>
                <span className="text-sm font-extrabold text-slate-800 font-numeric-stat">{requiredParams.pass}</span>
              </div>
              <button
                onClick={() => copyToClipboard(requiredParams.pass, 'pass')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copiedField === 'pass' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUBMISSION FORM CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">send</span>
              <span>Gmail Account Submission Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your newly created Gmail address and password below to submit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gmail Address Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Gmail Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    placeholder="example123@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    lock
                  </span>
                  <input
                    type="text"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={requiredParams.pass}
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Note / Additional details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Additional Note (Optional)
              </label>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write any additional comments or notes..."
                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Submit Gmail Account</span>
            </button>
          </form>

          {/* Recently Submitted Accounts List */}
          {submittedList.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Recently Submitted Accounts:</h4>
              <div className="space-y-1.5">
                {submittedList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                      <span className="font-bold text-slate-800">{item.gmail}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Pending Review
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
              <span>Detailed Guidelines & Instructions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STEP 1: HOW TO CREATE */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                1. How to Create the Gmail Account
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Open your mobile browser or Gmail app and select <strong>"Add another account"</strong>.</li>
                <li>Tap <strong>"Create account"</strong> and select <strong>"For my personal use"</strong>.</li>
                <li>Enter the exact First Name (<strong>{requiredParams.fname}</strong>) and Last Name (<strong>{requiredParams.lname}</strong>) provided above.</li>
                <li>Set the password to the exact required password: <strong>{requiredParams.pass}</strong>.</li>
                <li>If prompted for phone number or recovery email, tap <strong>"Skip"</strong> (create without phone verification).</li>
              </ul>
            </div>

            {/* STEP 2: HOW TO SUBMIT */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                2. How to Submit on the Website
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>After creating the Gmail account, return to this submission page.</li>
                <li>Enter the new Gmail address in the <strong>"Gmail Address"</strong> field above.</li>
                <li>Enter the password in the <strong>"Account Password"</strong> field.</li>
                <li>Click the <strong>"Submit Gmail Account"</strong> button to send it for review.</li>
                <li>Admin will verify the account and credit funds directly to your wallet.</li>
              </ul>
            </div>

            {/* STEP 3: HOW TO DELETE FROM PHONE */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                3. How to Remove the Gmail Account from Your Phone
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>After submitting on this website, open your phone's <strong>Settings</strong>.</li>
                <li>Scroll down and select <strong>"Accounts & Sync"</strong> or <strong>"Passwords & Accounts"</strong>.</li>
                <li>Tap on the newly created Gmail account from the list.</li>
                <li>Tap <strong>"Remove Account"</strong> (or "Delete Account"). The email will be safely removed from your device.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

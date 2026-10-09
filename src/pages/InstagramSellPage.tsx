import React, { useState } from 'react';
import { PageType } from '../types';

interface InstagramSellPageProps {
  onNavigate: (page: PageType) => void;
  onSubmitInstagram?: (
    username: string,
    password: string,
    linkedEmail: string,
    emailPassword: string,
    followersCount: number,
    postsCount: number,
    has2FA: boolean,
    backupCodesOrNote?: string
  ) => void;
}

export const InstagramSellPage: React.FC<InstagramSellPageProps> = ({
  onNavigate,
  onSubmitInstagram
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [linkedEmailInput, setLinkedEmailInput] = useState('');
  const [emailPasswordInput, setEmailPasswordInput] = useState('');
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [has2FA, setHas2FA] = useState<boolean>(false);
  const [backupCodesOrNote, setBackupCodesOrNote] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [submittedList, setSubmittedList] = useState<
    { username: string; email: string; time: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameInput.trim() || !passwordInput.trim()) {
      alert('Please enter your Instagram username and password.');
      return;
    }

    if (!linkedEmailInput.trim() || !emailPasswordInput.trim()) {
      alert('Please enter the linked email address and email password.');
      return;
    }

    if (!termsAgreed) {
      alert('Please agree to the Instagram selling terms before submitting.');
      return;
    }

    const cleanUsername = usernameInput.trim().replace(/^@/, '');

    if (onSubmitInstagram) {
      onSubmitInstagram(
        cleanUsername,
        passwordInput.trim(),
        linkedEmailInput.trim(),
        emailPasswordInput.trim(),
        followersCount,
        postsCount,
        has2FA,
        backupCodesOrNote.trim()
      );
    }

    setSubmittedList((prev) => [
      {
        username: `@${cleanUsername}`,
        email: linkedEmailInput.trim(),
        time: 'Just now'
      },
      ...prev
    ]);

    setUsernameInput('');
    setPasswordInput('');
    setLinkedEmailInput('');
    setEmailPasswordInput('');
    setBackupCodesOrNote('');
    setTermsAgreed(false);

    alert('Instagram account submitted successfully! Admin will verify and credit ৳120 to your wallet. Please log out of the account from your device.');
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
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 text-rose-600 font-bold text-xs flex items-center gap-1.5 border border-rose-200/60">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram Sell Category</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-numeric-stat">
              ৳120.00 / $1.20 Per Account
            </span>
          </div>
        </div>

        {/* HIGHLIGHTED INSTRUCTION NOTICE BANNER AT TOP */}
        <div className="bg-amber-500/10 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-900 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-amber-900 flex items-center gap-1.5 font-display">
              <span>Important Notice:</span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
              Please read the rules carefully before selling your Instagram account. You must submit valid login credentials along with the original linked email password to the admin. You must log out of the account from your personal device after submitting, or payment will be rejected.
            </p>
          </div>
        </div>

        {/* HERO TITLE BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>High Reward Task</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Instagram Account Selling
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Earn money by selling your Instagram accounts. Submit accurate login credentials and the linked email to the admin and earn ৳120 ($1.20) for each verified account.
            </p>
          </div>
        </div>

        {/* TERMS & CONDITIONS CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-rose-600 text-[22px]">gavel</span>
              <span>Required Conditions for Instagram Selling</span>
            </h2>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              Mandatory Requirements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Condition 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>1. Valid Login Credentials</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You must provide the correct Instagram username and password.
              </p>
            </div>

            {/* Condition 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">account_box</span>
                <span>2. Active Account</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The account must be active and accessible. Any normal Instagram account is acceptable.
              </p>
            </div>

            {/* Condition 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>3. No Age or Follower Restrictions</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                There are no mandatory requirements for account age, minimum 3 posts, or 50+ followers.
              </p>
            </div>

            {/* Condition 4 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>4. Two-Factor Authentication (2FA Off)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn <strong>OFF</strong> 2-Step Verification before submitting, or provide working backup codes in the notes.
              </p>
            </div>

            {/* Condition 5 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>5. Linked Original Email</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You must provide the <strong>email and correct email password</strong> linked with this Instagram ID.
              </p>
            </div>

            {/* Condition 6 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>6. Remove Phone & Log Out</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unlink personal phone numbers and remember to <strong>log out</strong> from your device after submitting.
              </p>
            </div>
          </div>
        </div>

        {/* SUBMISSION FORM CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs mb-1.5">
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Admin Submission Form</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span>Instagram Account Submission Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in all details accurately for the administrator to review and verify your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Instagram Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="your_insta_username"
                    className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Instagram Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Instagram Password <span className="text-red-500">*</span>
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
                    placeholder="Enter Instagram password"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Linked Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Linked / Creation Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={linkedEmailInput}
                    onChange={(e) => setLinkedEmailInput(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Email Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    key
                  </span>
                  <input
                    type="text"
                    required
                    value={emailPasswordInput}
                    onChange={(e) => setEmailPasswordInput(e.target.value)}
                    placeholder="Enter email account password"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Followers Count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Followers Count (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                />
              </div>

              {/* Posts Count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Posts Count (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={postsCount}
                  onChange={(e) => setPostsCount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold"
                />
              </div>

              {/* 2FA Option */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Two-Factor Authentication (2FA)
                </label>
                <select
                  value={has2FA ? 'yes' : 'no'}
                  onChange={(e) => setHas2FA(e.target.value === 'yes')}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all font-semibold cursor-pointer"
                >
                  <option value="no">2FA is Disabled (Recommended)</option>
                  <option value="yes">2FA is Enabled (Backup Code Provided)</option>
                </select>
              </div>
            </div>

            {/* Note / Backup codes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                2FA Backup Codes / Additional Note (Optional)
              </label>
              <textarea
                rows={2}
                value={backupCodesOrNote}
                onChange={(e) => setBackupCodesOrNote(e.target.value)}
                placeholder="Enter 2FA backup codes or any special notes for the admin here..."
                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms-check-ig"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="terms-check-ig" className="text-xs text-slate-700 font-medium cursor-pointer leading-relaxed">
                I agree that after submitting, I will log out of this Instagram account from my device.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Submit Instagram Account</span>
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
                      <span className="font-bold text-slate-800">{item.username}</span>
                      <span className="text-slate-400 text-[11px]">({item.email})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Pending Review (৳১২০)
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
              <span>Detailed Step-by-Step Instructions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STEP 1 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                1. Prepare Account
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Verify that your Instagram username and password are accurate and active.</li>
                <li>Make sure the profile is functioning properly with basic details.</li>
                <li>There is no minimum requirement for account age, posts, or followers.</li>
                <li>Unlink or remove your personal phone number from the account settings.</li>
              </ul>
            </div>

            {/* STEP 2 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                2. Submit to Admin
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Enter your exact Instagram username and password into the submission form.</li>
                <li>Provide the linked email address and its correct password.</li>
                <li>Ensure 2FA is turned off or valid backup codes are provided in the note.</li>
                <li>Click <strong>"Submit Instagram Account"</strong> to send the details to admin.</li>
              </ul>
            </div>

            {/* STEP 3 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                3. Logout & Payout
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>After submission, promptly <strong>Log Out</strong> of the account from your device.</li>
                <li>The admin will verify credentials and confirm account access.</li>
                <li>Once verified, <strong>৳120 ($1.20)</strong> will be immediately credited to your balance.</li>
                <li>Withdraw funds anytime via bKash, Nagad, or Rocket.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

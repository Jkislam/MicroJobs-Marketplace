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
  const [otpContactInput, setOtpContactInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [submittedList, setSubmittedList] = useState<
    { phone: string; username: string; time: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneInput.trim()) {
      alert('Please enter your Telegram phone number with country code.');
      return;
    }

    if (!otpContactInput.trim()) {
      alert('Please provide your OTP contact method (WhatsApp number or mobile) so the admin can receive the login code.');
      return;
    }

    if (!termsAgreed) {
      alert('Please agree to the Telegram selling terms before submitting.');
      return;
    }

    if (onSubmitTelegram) {
      onSubmitTelegram(
        phoneInput.trim(),
        usernameInput.trim(),
        twoStepPasswordInput.trim(),
        'Personal Account',
        '',
        otpContactInput.trim(),
        noteInput.trim()
      );
    }

    setSubmittedList((prev) => [
      {
        phone: phoneInput.trim(),
        username: usernameInput.trim() ? `@${usernameInput.trim().replace(/^@/, '')}` : 'N/A',
        time: 'Just now'
      },
      ...prev
    ]);

    setPhoneInput('');
    setUsernameInput('');
    setTwoStepPasswordInput('');
    setOtpContactInput('');
    setNoteInput('');
    setTermsAgreed(false);

    alert('Telegram account submitted successfully! Admin will contact your provided OTP number to complete login and verify your account. Payout will be added to your balance.');
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
              Please read the rules carefully before selling your Telegram account. If Two-Step Cloud Password is enabled on your account, make sure to submit it accurately. The account must be free from SpamBot restrictions. You must assist with the OTP code during admin login verification.
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
              Telegram Account Selling
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Earn money by selling your Telegram accounts. Submit your active phone number and cloud password, share the login OTP with the admin, and receive instant cash rewards.
            </p>
          </div>
        </div>

        {/* TERMS & CONDITIONS CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-sky-600 text-[22px]">gavel</span>
              <span>Required Conditions for Telegram Selling</span>
            </h2>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              Mandatory Requirements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Condition 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>1. Account Age & Status</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Telegram account must be at least <strong>1 to 2 months old</strong> and active. Freshly created accounts prone to ban will not be accepted.
              </p>
            </div>

            {/* Condition 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>2. SpamBot Clean Check</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send a message to <strong>@SpamBot</strong> inside Telegram to confirm that your account is free of limits and reports.
              </p>
            </div>

            {/* Condition 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">password</span>
                <span>3. Two-Step Password</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If Two-Step Cloud Verification password is set on the account, provide the <strong>exact password</strong> in the form.
              </p>
            </div>

            {/* Condition 4 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">phonelink_ring</span>
                <span>4. Active Number & OTP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Be ready to provide the <strong>login verification code (OTP)</strong> sent to your number when the admin logs in.
              </p>
            </div>

            {/* Condition 5 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">phone</span>
                <span>5. Contact for OTP Delivery</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide a working WhatsApp number or active phone where the admin can reach you directly to request the OTP.
              </p>
            </div>

            {/* Condition 6 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">devices</span>
                <span>6. Terminate Active Session</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                After the admin confirms the login and payment, open Telegram Settings &gt; Devices and <strong>terminate other sessions</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* SUBMISSION FORM CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-1.5">
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Admin Submission Form</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span>Telegram Account Submission Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in all details accurately for the administrator to review and verify your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telegram Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Telegram Phone (with Country Code) <span className="text-red-500">*</span>
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
                  Telegram Username (Optional)
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
                  Two-Step Verification Cloud Password (Optional)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                    password
                  </span>
                  <input
                    type="text"
                    value={twoStepPasswordInput}
                    onChange={(e) => setTwoStepPasswordInput(e.target.value)}
                    placeholder="Enter cloud password if enabled (otherwise leave blank)"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* WhatsApp or OTP contact */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Contact for OTP Delivery (WhatsApp / Mobile) <span className="text-red-500">*</span>
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
                    placeholder="WhatsApp: +88017... or active phone number"
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Note / Additional info (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Additional Note or Info (Optional)
              </label>
              <textarea
                rows={2}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Account age, special details, or any notes for the admin (optional)..."
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
                I agree that this account is active and free from SpamBot restrictions. I will provide the login OTP code to the admin and terminate previous sessions afterward.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Submit Telegram Account</span>
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
                      Pending Review (৳80)
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
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                1. Check SpamBot & Credentials
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Search for <strong>@SpamBot</strong> inside Telegram and tap Start.</li>
                <li>Ensure the bot replies with "Good news, no limits are applied".</li>
                <li>If Two-Step Verification is enabled, remember or note your cloud password.</li>
                <li>Make sure the SIM number is active to receive the login SMS/Telegram code.</li>
              </ul>
            </div>

            {/* STEP 2 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                2. Submit to Admin
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Enter your Telegram phone number with the country code in the form.</li>
                <li>Provide username and Two-Step Cloud Password (if enabled).</li>
                <li>Provide your WhatsApp or mobile number for OTP contact.</li>
                <li>Click <strong>"Submit Telegram Account"</strong> to send the details.</li>
              </ul>
            </div>

            {/* STEP 3 */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                3. OTP Confirmation & Payout
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc pl-4">
                <li>Admin initiates the login and an OTP code is sent to your device.</li>
                <li>Share the OTP with the admin via WhatsApp/Call to complete verification.</li>
                <li>Once approved, your account balance is immediately credited with <strong>৳80 ($0.80)</strong>.</li>
                <li>Open Settings &gt; Devices in Telegram and terminate other sessions.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

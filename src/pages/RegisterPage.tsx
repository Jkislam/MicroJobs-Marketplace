import React, { useState } from 'react';
import { PageType } from '../types';

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
  onRegisterSuccess: (details: {
    fullName: string;
    username: string;
    email: string;
    role: 'worker' | 'client';
  }) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [role, setRole] = useState<'worker' | 'client'>('worker');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const pwdMatches = confirmPassword && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdMatches || !agreed) return;
    onRegisterSuccess({
      fullName,
      username,
      email,
      role
    });
    onNavigate('profile');
  };

  return (
    <div className="w-full bg-slate-50/60 py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Form Panel */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="mb-6 space-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20 mb-3">
                M
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-500">
                Join MicroJobs and start completing tasks or posting jobs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name and Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Alex Johnson"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., alexj"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 chars"
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">Confirm Password</label>
                    {confirmPassword && (
                      <span className={`text-[10px] font-bold ${pwdMatches ? 'text-emerald-600' : 'text-red-500'}`}>
                        {pwdMatches ? 'Matches' : 'Does not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-tight">
                    I agree to the <span className="font-bold text-blue-600 underline">Terms & Conditions</span> and <span className="font-bold text-blue-600 underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed || !pwdMatches}
                className={`w-full h-11 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  agreed && pwdMatches
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    : 'bg-slate-300 text-white cursor-not-allowed'
                }`}
              >
                <span>Create Account</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-4">
              <span>Already have an account? </span>
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          {/* Right Promotional Panel */}
          <div className="w-full lg:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Next-Gen Gig Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                Start your journey with MicroJobs
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                The fastest growing micro-task platform with guaranteed escrow security and daily payouts.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-200 text-lg">manage_search</span>
                  <div>
                    <h3 className="font-bold text-white">Find Tasks</h3>
                    <p className="text-blue-100 text-[11px] mt-0.5">Access hundreds of verified micro-jobs every day.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-200 text-lg">task_alt</span>
                  <div>
                    <h3 className="font-bold text-white">Complete Work</h3>
                    <p className="text-blue-100 text-[11px] mt-0.5">Submit screenshot proofs effortlessly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-200 text-lg">account_balance_wallet</span>
                  <div>
                    <h3 className="font-bold text-white">Earn Money</h3>
                    <p className="text-blue-100 text-[11px] mt-0.5">Instant automated escrow protection.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/20 mt-6 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold block text-white">4.9 / 5 Rating</span>
                <span className="text-[11px] text-blue-200">120,000+ Active Members</span>
              </div>
              <div>
                <span className="font-bold block text-white">100% Escrow</span>
                <span className="text-[11px] text-blue-200">Secured Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

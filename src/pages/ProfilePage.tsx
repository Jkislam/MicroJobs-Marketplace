import React, { useState } from 'react';
import { UserProfileData } from '../types';

interface ProfilePageProps {
  user: UserProfileData;
  onUpdateUser: (updated: UserProfileData) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [activeRole, setActiveRole] = useState<'worker' | 'client'>(user.role);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [newMethodName, setNewMethodName] = useState('Nagad Direct');
  const [newMethodDetails, setNewMethodDetails] = useState('+880 1819-••••••');

  const handleCopyUsername = () => {
    navigator.clipboard?.writeText(user.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName,
      phone,
      bio,
      role: activeRole
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAccounts = [
      ...user.payoutAccounts,
      {
        id: `p-${Date.now()}`,
        method: newMethodName,
        details: newMethodDetails,
        isDefault: false,
        type: 'Instant'
      }
    ];
    onUpdateUser({
      ...user,
      payoutAccounts: updatedAccounts
    });
    setAddPaymentModal(false);
  };

  return (
    <div className="w-full bg-slate-50/60 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Context & Header */}
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span>Account Settings</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Profile Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            My Profile
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Manage your personal information, task statistics, payment methods, and account security.
          </p>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 ring-4 ring-blue-50 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </div>

              {/* Identity & Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900 font-headline-md">{fullName}</h2>
                  <button
                    onClick={handleCopyUsername}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{user.username}</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold shadow-xs">
                    {activeRole === 'worker' ? 'Worker' : 'Client'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Email Verified
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    Member Since: {user.memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Edit mode activated below.')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
              <span className="material-symbols-outlined text-blue-600 text-[20px]">task_alt</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-numeric-stat">{user.completedTasks}</span>
              <span className="text-xs font-bold text-emerald-600">+12 this month</span>
            </div>
            <p className="text-[11px] text-slate-500">98.5% completion rate • Zero disputes</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
              <span className="material-symbols-outlined text-blue-600 text-[20px]">account_balance_wallet</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-numeric-stat">${user.totalEarnings.toFixed(2)}</span>
              <span className="text-xs font-bold text-blue-600">USD</span>
            </div>
            <p className="text-[11px] text-slate-500">$46.20 available in Escrow / Wallet</p>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            {/* Personal Details Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-headline-md">Personal Details</h3>
                  <p className="text-xs text-slate-500">Your official account and contact information.</p>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                  Profile information updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Username</label>
                    <input
                      type="text"
                      readOnly
                      value={user.username}
                      className="w-full h-10 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full h-10 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Country / Region</label>
                    <input
                      type="text"
                      readOnly
                      value={user.country}
                      className="w-full h-10 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFullName(user.fullName);
                      setPhone(user.phone);
                      setBio(user.bio);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Account Role & Mode Toggle */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-headline-md">Account Role & Mode</h3>
              <p className="text-xs text-slate-500">Toggle your active workspace mode. Both capabilities are unlocked.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setActiveRole('worker')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeRole === 'worker'
                      ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-slate-900">
                      <span className="material-symbols-outlined text-blue-600 text-lg">engineering</span>
                      Worker Mode
                    </span>
                    <span className={`w-3 h-3 rounded-full ${activeRole === 'worker' ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                    Primary active role. Browse micro-gigs, complete verification assignments, and withdraw earned payouts.
                  </p>
                </div>

                <div
                  onClick={() => setActiveRole('client')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeRole === 'client'
                      ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-slate-900">
                      <span className="material-symbols-outlined text-blue-600 text-lg">business_center</span>
                      Client Mode
                    </span>
                    <span className={`w-3 h-3 rounded-full ${activeRole === 'client' ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                    Create new micro-tasks, review submitted proof submissions, and manage marketing campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            {/* Payout Accounts */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-headline-md">Payout Accounts</h3>
                  <p className="text-xs text-slate-500">Where your gig earnings are delivered.</p>
                </div>
              </div>

              <div className="space-y-3">
                {user.payoutAccounts.map((acc) => (
                  <div key={acc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 font-extrabold text-sm flex items-center justify-center">
                        {acc.method.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">{acc.method}</span>
                          {acc.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Default</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{acc.details}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{acc.type}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setAddPaymentModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Payment Method</span>
              </button>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-headline-md">Security & Login</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Password</span>
                    <span className="text-slate-500">Updated 45 days ago</span>
                  </div>
                  <button
                    onClick={() => alert('Password update form modal opened.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Two-Factor (2FA)</span>
                    <span className="text-emerald-600 font-semibold">Enabled (Authenticator App)</span>
                  </div>
                  <button
                    onClick={() => alert('2FA configurations.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <span className="material-symbols-outlined">warning</span>
                <span>Danger Zone</span>
              </div>
              <p className="text-xs text-slate-500">Irreversible account operations.</p>

              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Deactivate Account</span>
                  <span className="text-slate-500">Temporarily pause gigs.</span>
                </div>
                <button
                  onClick={() => alert('Account deactivation paused.')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add Payment */}
        {addPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Payout Account</h3>
              <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Method Name</label>
                  <select
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="Nagad Direct">Nagad Direct</option>
                    <option value="Rocket Mobile">Rocket Mobile</option>
                    <option value="PayPal Express">PayPal Express</option>
                    <option value="Crypto USDT Wallet">Crypto USDT Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number / Wallet ID</label>
                  <input
                    type="text"
                    required
                    value={newMethodDetails}
                    onChange={(e) => setNewMethodDetails(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddPaymentModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-sm"
                  >
                    Save Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

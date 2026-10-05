import React, { useState } from 'react';
import { PageType, UserProfileData, WithdrawalRequest } from '../types';

interface ProfilePageProps {
  user: UserProfileData;
  withdrawals?: WithdrawalRequest[];
  onUpdateUser: (updated: UserProfileData) => void;
  onNavigate: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, withdrawals = [], onUpdateUser, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodDetails, setNewMethodDetails] = useState('');
  const [newMethodType, setNewMethodType] = useState('48 h to 72 h');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Account Activation Deposit State
  const [activationModal, setActivationModal] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [numberCopied, setNumberCopied] = useState<string | null>(null);

  // Filter admin-approved disbursements for current user
  const userApprovedWithdrawals = withdrawals.filter((w) => {
    const isApproved = w.status === 'disbursed';
    const matchesUser =
      w.username?.toLowerCase() === user.username?.toLowerCase() ||
      w.freelancerName?.toLowerCase().includes(user.fullName?.toLowerCase() || '') ||
      w.username === '@sabbir' ||
      w.username === '@sabbir_pro';
    return isApproved && matchesUser;
  });

  const handleCopyUsername = () => {
    navigator.clipboard?.writeText(user.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim() || !trxId.trim()) {
      alert('Please enter your sender mobile number and Transaction ID (TrxID).');
      return;
    }

    const updatedUser: UserProfileData = {
      ...user,
      isActivated: false,
      activationStatus: 'pending',
      activationTrxId: trxId.trim(),
      activationSenderPhone: senderPhone.trim(),
      activationMethod: depositMethod,
      activationSubmittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateUser(updatedUser);
    setActivationModal(false);
    setSenderPhone('');
    setTrxId('');
    setDepositSuccessMsg('৳50 Fee Deposit Submitted! Awaiting Admin approval before account activation.');
    setTimeout(() => setDepositSuccessMsg(null), 6000);
  };

  const handleAdminApprove = () => {
    onUpdateUser({
      ...user,
      isActivated: true,
      activationStatus: 'approved'
    });
    setDepositSuccessMsg('Account activation approved by Admin! Your account is now fully active.');
    setTimeout(() => setDepositSuccessMsg(null), 5000);
  };

  const handleAdminReject = () => {
    onUpdateUser({
      ...user,
      isActivated: false,
      activationStatus: 'rejected'
    });
    setDepositSuccessMsg('Deposit request rejected by Admin. Please re-check your payment details.');
    setTimeout(() => setDepositSuccessMsg(null), 5000);
  };

  const openAddModal = () => {
    setNewMethodName('bKash Personal');
    setNewMethodDetails('');
    setNewMethodType('48 h to 72 h');
    setNewIsDefault(user.payoutAccounts.length === 0);
    setAddPaymentModal(true);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodName.trim() || !newMethodDetails.trim()) return;

    const newAcc = {
      id: `p-${Date.now()}`,
      method: newMethodName.trim(),
      details: newMethodDetails.trim(),
      isDefault: newIsDefault || user.payoutAccounts.length === 0,
      type: newMethodType
    };

    let updatedAccounts = [...user.payoutAccounts];
    if (newIsDefault) {
      updatedAccounts = updatedAccounts.map((acc) => ({ ...acc, isDefault: false }));
    }
    updatedAccounts.push(newAcc);

    onUpdateUser({
      ...user,
      payoutAccounts: updatedAccounts
    });

    setAddPaymentModal(false);
    setNewMethodName('');
    setNewMethodDetails('');
  };

  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = user.payoutAccounts.filter((acc) => acc.id !== id);
    if (updatedAccounts.length > 0 && !updatedAccounts.some((acc) => acc.isDefault)) {
      updatedAccounts[0].isDefault = true;
    }
    onUpdateUser({
      ...user,
      payoutAccounts: updatedAccounts
    });
  };

  const handleSetDefaultAccount = (id: string) => {
    const updatedAccounts = user.payoutAccounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id
    }));
    onUpdateUser({
      ...user,
      payoutAccounts: updatedAccounts
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateUser({
            ...user,
            avatar: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-slate-50/60 py-8 lg:py-12 relative">
      {/* Deposit Success Alert Banner */}
      {depositSuccessMsg && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-emerald-500">
          <span className="material-symbols-outlined text-emerald-300 text-xl">check_circle</span>
          <span>{depositSuccessMsg}</span>
        </div>
      )}

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
              {/* Avatar with Photo Upload */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-blue-100 ring-4 ring-blue-50 shadow-md relative">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-photo-input"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center ring-2 ring-white cursor-pointer shadow-md transition-all hover:scale-110"
                  title="Upload / Change Profile Photo (ছবি আপলোড করুন)"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Identity & Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900 font-headline-md">{user.fullName}</h2>
                  <button
                    onClick={handleCopyUsername}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>@{user.username}</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold shadow-xs">
                    {user.role === 'worker' ? 'Worker' : 'Client'}
                  </span>
                  
                  {/* Account Activation Badge */}
                  {user.isActivated || user.activationStatus === 'approved' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      Account Active (৳50 Fee Paid)
                    </span>
                  ) : user.activationStatus === 'pending' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center gap-1 border border-amber-300">
                      <span className="material-symbols-outlined text-[15px] animate-pulse">hourglass_top</span>
                      Deposit Pending Admin Approval
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActivationModal(true)}
                      className="px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold flex items-center gap-1 cursor-pointer transition-all hover:shadow-md hover:scale-105"
                      title="Click to deposit ৳50 activation fee"
                    >
                      <span className="material-symbols-outlined text-[15px]">warning</span>
                      Activation Pending (৳50 Fee)
                    </button>
                  )}

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
                onClick={() => onNavigate('edit-profile')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACCOUNT ACTIVATION FEE BANNER */}
        {user.isActivated || user.activationStatus === 'approved' ? (
          <div className="rounded-2xl p-5 sm:p-6 border transition-all relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/30 text-white shadow-md">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-20 bg-emerald-400" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md bg-emerald-500 text-white ring-4 ring-emerald-500/20">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-white">Account Status: Fully Activated</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active & Approved
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    Your account has been verified and approved by Admin with the ৳50 BDT fee deposit. {user.activationTrxId ? `(TrxID: ${user.activationTrxId})` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : user.activationStatus === 'pending' ? (
          <div className="rounded-2xl p-5 sm:p-6 border transition-all relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-amber-500/30 text-white shadow-xl shadow-amber-950/20">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-20 bg-amber-500" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-4 ring-amber-500/20">
                  <span className="material-symbols-outlined text-2xl animate-pulse">hourglass_top</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-white">Account Status: Pending Admin Approval</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Awaiting Admin Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    Your ৳50 BDT deposit request via <strong className="text-amber-300">{user.activationMethod || 'Mobile Banking'}</strong> (Sender: <span className="font-mono text-amber-200">{user.activationSenderPhone || 'N/A'}</span>, TrxID: <span className="font-mono text-amber-200">{user.activationTrxId}</span>) has been submitted. Your account will become active once an Admin approves your deposit.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAdminApprove}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
                  title="Admin action: Approve this deposit request"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Approve (Admin Action)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Admin Console</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-5 sm:p-6 border transition-all relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white shadow-xl shadow-indigo-950/20">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-20 bg-indigo-500" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-indigo-500 to-blue-600 text-white ring-4 ring-indigo-500/20">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-white">Account Status: Activation Required</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Pending ৳50 Fee
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    Deposit a ৳50 BDT activation fee to submit your account for Admin review and activation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivationModal(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Deposit ৳50 Activation Fee</span>
              </button>
            </div>
          </div>
        )}

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
            {/* Personal Details Read-Only Display */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-headline-md">Personal Details</h3>
                  <p className="text-xs text-slate-500">Your official account and contact information.</p>
                </div>
                <button
                  onClick={() => onNavigate('edit-profile')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Username</span>
                    <span className="font-mono text-slate-700 text-xs font-semibold">@{user.username}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Email Address</span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Phone Number</span>
                    <span className="font-semibold text-slate-800">{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Country / Region</span>
                    <span className="font-semibold text-slate-800">{user.country || 'Bangladesh'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Professional Bio</span>
                  <p className="text-slate-700 leading-relaxed">{user.bio || 'No bio added yet.'}</p>
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
                {user.payoutAccounts && user.payoutAccounts.length > 0 ? (
                  user.payoutAccounts.map((acc) => (
                    <div key={acc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {acc.method.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">{acc.method}</span>
                            {acc.isDefault ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Default</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAccount(acc.id)}
                                className="text-[10px] font-bold text-slate-400 hover:text-blue-600 cursor-pointer underline"
                              >
                                Set Default
                              </button>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-mono block truncate">{acc.details}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-emerald-600 hidden sm:inline">{acc.type}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Account"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <span className="material-symbols-outlined text-slate-300 text-3xl">account_balance_wallet</span>
                    <p className="text-xs font-bold text-slate-700">No Payout Accounts Added Yet</p>
                    <p className="text-[11px] text-slate-500">Click below to add your bKash, Nagad, Rocket or Bank details.</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Payment Method</span>
              </button>
            </div>
            {/* Withdrawals History (Admin Approved Payouts) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-lg font-bold text-slate-900 font-headline-md">Withdrawals History</h3>
                  </div>
                  <p className="text-xs text-slate-500">Payout requests approved and disbursed by Admin.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] flex items-center gap-1 border border-emerald-200">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Admin Approved
                </span>
              </div>

              {/* Withdrawals List */}
              <div className="space-y-3">
                {userApprovedWithdrawals && userApprovedWithdrawals.length > 0 ? (
                  userApprovedWithdrawals.map((w) => (
                    <div key={w.id} className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 shadow-2xs">
                          <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm font-numeric-stat">${w.amount.toFixed(2)} USD</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Disbursed
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium truncate mt-0.5">
                            {w.method} <span className="text-slate-400">•</span> <span className="font-mono text-slate-500 text-[11px]">{w.accountDetails}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-slate-400 block">{w.requestedAgo}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">{w.id}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <span className="material-symbols-outlined text-slate-300 text-3xl">account_balance</span>
                    <p className="text-xs font-bold text-slate-700">No Approved Withdrawals Yet</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Once your payout requests are reviewed and approved by the Admin, your complete payment history will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-headline-md">Security & Login</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Password</span>
                    <span className="text-slate-500">Updated recently</span>
                  </div>
                  <button
                    onClick={() => alert('Password change form option.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {addPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Payment Account</h3>
              <button
                type="button"
                onClick={() => setAddPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method / Provider</label>
                <select
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-2"
                >
                  <option value="bKash Personal">bKash Personal</option>
                  <option value="Nagad Direct">Nagad Direct</option>
                  <option value="Rocket Wallet">Rocket Wallet</option>
                  <option value="Upay Personal">Upay Personal</option>
                  <option value="CellFin Account">CellFin Account</option>
                  <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                  <option value="PayPal Express">PayPal Express</option>
                  <option value="Custom">Custom Method</option>
                </select>
                {newMethodName === 'Custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom payment method name"
                    onChange={(e) => setNewMethodName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Account Number / Wallet Details</label>
                <input
                  type="text"
                  required
                  value={newMethodDetails}
                  onChange={(e) => setNewMethodDetails(e.target.value)}
                  placeholder="e.g. +880 1712-345678 or Account No."
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Processing Speed</label>
                <select
                  value={newMethodType}
                  onChange={(e) => setNewMethodType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
                >
                  <option value="48 h to 72 h">48 h to 72 h</option>
                  <option value="Instant">Instant Payout</option>
                  <option value="24 Hours">24 Hours Standard</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="set-default-check"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="set-default-check" className="text-slate-700 font-medium cursor-pointer">
                  Set as primary default payout method
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-all shadow-sm"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Activation Deposit Modal */}
      {activationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Account Activation Fee Deposit</h3>
                  <p className="text-xs text-slate-500">Deposit ৳50 BDT to activate your account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivationModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-indigo-50/50 border border-indigo-100 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-indigo-950 text-sm">
                <span>Required Activation Fee:</span>
                <span className="text-xl font-extrabold text-indigo-600 font-numeric-stat">৳50 BDT</span>
              </div>
              <p className="text-indigo-900 leading-relaxed text-[11px]">
                Send <strong>৳50 BDT</strong> via <strong>Send Money</strong> to any personal account below, then enter your sender mobile number and Transaction ID (TrxID) to complete activation.
              </p>
            </div>

            {/* Payment Provider Options */}
            <div className="space-y-3.5 text-xs">
              <label className="block text-slate-800 font-bold">1. Select Payment Provider:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'bKash', name: 'bKash', num: '01712-345678', color: 'border-pink-500 bg-pink-50/80 text-pink-900' },
                  { id: 'Nagad', name: 'Nagad', num: '01812-345678', color: 'border-amber-500 bg-amber-50/80 text-amber-900' },
                  { id: 'Rocket', name: 'Rocket', num: '01912-345678', color: 'border-purple-500 bg-purple-50/80 text-purple-900' }
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setDepositMethod(prov.id as 'bKash' | 'Nagad' | 'Rocket')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer font-bold ${
                      depositMethod === prov.id
                        ? `${prov.color} ring-2 ring-indigo-500/20 shadow-xs scale-102`
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm font-extrabold">{prov.name}</div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Personal</span>
                  </button>
                ))}
              </div>

              {/* Selected Provider Details Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">
                    Send Money Number ({depositMethod} Personal):
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {depositMethod === 'bKash' ? '01712-345678' : depositMethod === 'Nagad' ? '01812-345678' : '01912-345678'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const num = depositMethod === 'bKash' ? '01712345678' : depositMethod === 'Nagad' ? '01812345678' : '01912345678';
                    navigator.clipboard?.writeText(num);
                    setNumberCopied(depositMethod);
                    setTimeout(() => setNumberCopied(null), 2000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-indigo-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {numberCopied === depositMethod ? 'done' : 'content_copy'}
                  </span>
                  <span>{numberCopied === depositMethod ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Deposit Submission Form */}
              <form onSubmit={handleDepositActivation} className="space-y-4 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    2. Sender Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    3. Transaction ID (TrxID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9H82JKS10"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActivationModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold cursor-pointer transition-all shadow-md text-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Submit Deposit (৳50 BDT)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

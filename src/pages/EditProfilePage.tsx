import React, { useState } from 'react';
import { PageType, UserProfileData } from '../types';

interface EditProfilePageProps {
  user: UserProfileData;
  onUpdateUser: (updated: UserProfileData) => void;
  onNavigate: (page: PageType) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [country, setCountry] = useState(user.country || 'Bangladesh');
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName,
      phone,
      country,
      bio,
      avatar
    });
    onNavigate('profile');
  };

  return (
    <div className="w-full bg-slate-50/60 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer mb-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Profile</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Edit Profile
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Update your account information, bio, contact details, and workspace role.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Locked Information Notice */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs">
            <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">lock</span>
            <div className="space-y-1">
              <span className="font-bold text-amber-900 block">Restricted Account Fields</span>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                For platform security and identity verification, <strong>Username</strong> and <strong>Email Address</strong> cannot be changed. All other fields are fully editable below.
              </p>
            </div>
          </div>

          {/* Locked Fields Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Account Credentials (Read-Only)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1 flex items-center justify-between">
                  <span>Username</span>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Locked
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.username}
                    readOnly
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 font-mono font-bold cursor-not-allowed select-none"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    lock
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Locked
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 font-bold cursor-not-allowed select-none"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    verified_user
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Personal Details Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 font-headline-md">
              Personal Information
            </h2>

            <div className="space-y-4 text-xs">
              {/* Profile Photo Upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 ring-2 ring-blue-500/20 shrink-0 shadow-xs">
                    <img
                      src={avatar}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Profile Photo</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">JPG, PNG or GIF (Max 5MB)</span>
                  </div>
                </div>

                <label
                  htmlFor="edit-profile-photo-input"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span>Upload Photo</span>
                  <input
                    id="edit-profile-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +880 1712-345678"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., Bangladesh"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your skills, experience, or micro-job goals..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

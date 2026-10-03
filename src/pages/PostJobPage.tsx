import React, { useState } from 'react';
import { Job, PageType } from '../types';

interface PostJobPageProps {
  onAddJob: (newJob: Job) => void;
  onNavigate: (page: PageType) => void;
}

export const PostJobPage: React.FC<PostJobPageProps> = ({ onAddJob, onNavigate }) => {
  const [title, setTitle] = useState('Test our mobile-friendly checkout flow and submit bug logs');
  const [category, setCategory] = useState('Website Testing');
  const [description, setDescription] = useState(
    'We are rolling out an optimized checkout cart for our digital goods shop. We need real users on desktop & mobile browsers to simulate cart additions, apply a promo voucher, verify pricing totals, and identify friction points in the payment selector UI.'
  );
  const [instructionsText, setInstructionsText] = useState(
    `Step 1: Open Chrome, Firefox, or Safari and go to https://staging.micro-shop.test/demo
Step 2: Add any 2 digital assets to your shopping bag
Step 3: Proceed to checkout and enter discount code "TESTFREE2024"
Step 4: Check if total recalculates to $0.00 without throwing a console error
Step 5: Fill sample shipping fields and submit confirmation
Step 6: Capture full-page screenshot of the "Order Confirmed" screen showing your generated Order ID`
  );
  const [requirements, setRequirements] = useState(
    'Desktop Chrome or Firefox browser, basic English reading, verified MicroJobs account.'
  );

  const [reward, setReward] = useState<number>(0.50);
  const [workers, setWorkers] = useState<number>(100);
  const [deadline, setDeadline] = useState('3 Days (72 Hours)');

  const [proofScreenshot, setProofScreenshot] = useState(true);
  const [proofText, setProofText] = useState(true);
  const [proofUrl, setProofUrl] = useState(false);
  const [proofFile, setProofFile] = useState(false);

  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const subtotal = (reward || 0) * (workers || 0);
  const fee = subtotal * 0.05;
  const totalEscrow = subtotal + fee;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || reward <= 0 || workers <= 0) return;

    const instructionsArray = instructionsText
      .split('\n')
      .filter((line) => line.trim().length > 0);

    const newJob: Job = {
      id: `JB-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      category,
      reward,
      availableSlots: workers,
      totalSlots: workers,
      description,
      instructions: instructionsArray.length > 0 ? instructionsArray : ['Follow client guidelines provided.'],
      requirements: ['Desktop Browser', 'English Fluency', 'ID Verified Earner'],
      daysLeft: 3,
      client: {
        name: 'Sabbir Islam',
        username: '@sabbir',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        rating: 5.0,
        reviewsCount: 12,
        badgeText: 'Top Employer'
      },
      status: 'active',
      createdAt: 'Just now'
    };

    onAddJob(newJob);
    setPublishedSuccess(true);
    setTimeout(() => {
      onNavigate('find-jobs');
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Employer Workspace • Instant Task Publishing</span>
            </div>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight font-display">
              Post a Job
            </h1>
            <p className="text-slate-600 text-sm">
              Create a task and find vetted global workers to complete it within hours.
            </p>
          </div>

          {/* Step Indicator */}
          <nav aria-label="Progress" className="bg-white p-2 rounded-2xl shadow-xs border border-slate-100">
            <ol className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
              <li className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-700 text-[11px] font-extrabold">1</span>
                <span>Task Details</span>
              </li>
              <li className="text-slate-300">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </li>
              <li className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">2</span>
                <span>Budget & Escrow</span>
              </li>
              <li className="text-slate-300">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </li>
              <li className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">3</span>
                <span>Review & Fund</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* POLICY & TRUST BANNER */}
        <section className="rounded-2xl p-4 sm:p-5 bg-blue-100/60 text-slate-900 border border-blue-200/60 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                gavel
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Policy Compliance Notice</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-blue-700">Strict Enforcement</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only post lawful tasks and content you have explicit rights to request. Do not request account passwords, multi-factor codes, KYC document harvesting, stolen credentials, or unapproved app installations. Violating jobs are automatically removed by machine moderation.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN FORM GRID */}
        <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: SPECIFICATIONS */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-headline-md">Job Specifications</h2>
                  <p className="text-xs text-slate-500">Provide clear directions so workers execute with high precision.</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span> MicroJobs Standard
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-bold text-slate-800">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{title.length}/100 chars</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-50 text-slate-900 text-xs font-medium border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg">
                    check_circle
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Give a concise, descriptive title outlining the primary deliverable.</p>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Primary Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-50 text-slate-900 text-xs font-medium border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="Website Testing">Website Testing</option>
                    <option value="Data Entry">Data Entry</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Surveys">Surveys</option>
                    <option value="Writing & Proofreading">Writing & Proofreading</option>
                    <option value="Design">Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="App Testing">App Testing</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <span>Recommended sub-category:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[11px]">E-Commerce QA</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs leading-relaxed border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Task Instructions (Step-by-Step) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setInstructionsText((prev) => prev + `\nStep ${prev.split('\n').length + 1}: `)}
                    className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span> Add Formatted Step
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs font-mono border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">Numbered steps help workers deliver accurate results quickly.</p>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Worker Requirements & Skills (Optional)</label>
                <input
                  type="text"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <div className="flex flex-wrap gap-2 pt-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    <span className="material-symbols-outlined text-xs">devices</span> Desktop Browser
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    <span className="material-symbols-outlined text-xs">translate</span> English Fluency
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    <span className="material-symbols-outlined text-xs">verified</span> ID Verified Earner
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: BUDGET & ESCROW */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-headline-md">Budget & Delivery</h2>
                  <p className="text-xs text-slate-500">Real-time escrow calculation</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                </div>
              </div>

              {/* Reward Per Task */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Reward Per Task ($) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-bold">Fast Completion Tier</span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.10"
                    value={reward}
                    onChange={(e) => setReward(parseFloat(e.target.value) || 0.10)}
                    required
                    className="w-full h-11 pl-8 pr-12 rounded-xl bg-slate-50 text-slate-900 text-sm font-bold font-numeric-stat border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">USD</span>
                </div>
              </div>

              {/* Worker Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Number of Workers (Available Slots) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-bold">{workers} Slots</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={workers}
                  onChange={(e) => setWorkers(parseInt(e.target.value) || 1)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-sm font-bold font-numeric-stat border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />

                {/* Presets */}
                <div className="flex items-center gap-1.5 pt-1 text-xs">
                  <span className="text-slate-400 mr-1 font-medium">Presets:</span>
                  {[25, 50, 100, 250, 500].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setWorkers(num)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        workers === num
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Breakdown Card */}
              <div className="rounded-xl p-4 bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Escrow Breakdown</span>
                  <span className="text-blue-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span> Protected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Task Rewards ({workers} × ${reward.toFixed(2)})</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Escrow & Guarantee Fee (5%)</span>
                    <span className="font-bold text-slate-900">${fee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Total Escrow</span>
                    <span className="text-[11px] text-slate-400">Funds committed on publish</span>
                  </div>
                  <span className="text-2xl font-extrabold text-blue-600 font-numeric-stat">
                    ${totalEscrow.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Task Deadline <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Required Proof */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Required Proof for Verification</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proofScreenshot}
                      onChange={(e) => setProofScreenshot(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 accent-blue-600"
                    />
                    <span className="font-medium text-slate-800 flex-1">Screenshot proof (image upload)</span>
                  </label>
                  <label className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proofText}
                      onChange={(e) => setProofText(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 accent-blue-600"
                    />
                    <span className="font-medium text-slate-800 flex-1">Text response / Transaction ID</span>
                  </label>
                </div>
              </div>
            </div>

            {/* DOCKED BOTTOM ACTION BAR */}
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Total Escrow: ${totalEscrow.toFixed(2)}</span>
                  <span className="text-slate-500">{workers} Workers Slot Allocation</span>
                </div>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">shield</span> 100% Refundable
                </span>
              </div>

              {publishedSuccess ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  <span>Job Published & Escrow Funded! Redirecting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert('Draft saved to employer workspace.')}
                    className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Publish Job & Fund Escrow</span>
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

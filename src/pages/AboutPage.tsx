import React from 'react';
import { PageType } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Our Mission • Empowering Global Micro-Work</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display mb-6">
                About <span className="text-blue-600">MicroJobs</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
                A simple, secure marketplace connecting individuals and enterprises who need targeted digital tasks completed with global workers looking for flexible, reliable online opportunities.
              </p>

              {/* Highlights & Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs border border-slate-200">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">verified_user</span>
                  <span>Escrow Protected Payouts</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs border border-slate-200">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">task_alt</span>
                  <span>Over 100,000+ Completed Tasks</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs border border-slate-200">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">public</span>
                  <span>Global Community in 50+ Countries</span>
                </div>
              </div>
            </div>

            {/* Network Escrow Pool Graphic */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">hub</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">MicroJobs Network</div>
                      <div className="text-xs text-slate-400">Real-Time Execution Hub</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Active</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-500 block">Network Escrow Pool</span>
                    <span className="text-xl font-extrabold text-slate-900 font-numeric-stat">$248,930.00</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">devices</span>
                      <div>
                        <span className="font-bold text-slate-800 block">Mobile QA Testing #4928</span>
                        <span className="text-slate-400">Proof verified in 12 min</span>
                      </div>
                    </div>
                    <span className="font-bold text-blue-600 font-numeric-stat">+$1.80</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">dataset</span>
                      <div>
                        <span className="font-bold text-slate-800 block">Dataset Entity Tagging</span>
                        <span className="text-slate-400">Proof approved automatically</span>
                      </div>
                    </div>
                    <span className="font-bold text-blue-600 font-numeric-stat">+$0.75</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Instant automated audits
                  </span>
                  <span className="text-blue-600 font-bold">Zero Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW MICROJOBS WORKS */}
      <section className="py-16 lg:py-20 bg-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Simple Execution Flow</span>
            <h2 className="text-3xl font-bold text-slate-900 font-headline-lg">How MicroJobs Works</h2>
            <p className="text-slate-600 text-sm mt-2">
              A transparent and seamless process designed for quick execution, dependable proofs, and guaranteed reward delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">manage_search</span>
                  </div>
                  <span className="font-numeric-stat text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">01</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Find a Job</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Browse available micro-jobs matching your capabilities and schedule. Filter by category, duration, and payout.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Available 24/7 on Web & Mobile</span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">assignment_turned_in</span>
                  </div>
                  <span className="font-numeric-stat text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">02</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Complete the Task</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Follow step-by-step briefs with exact deliverable guidelines. Easily upload screenshots or text responses.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Built-in Anti-Fraud Sandbox</span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                  </div>
                  <span className="font-numeric-stat text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">03</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Get Paid</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  After employer approval or 48h threshold, earnings are released directly to your withdrawable wallet.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Guaranteed 48h Review Window</span>
            </div>
          </div>
        </div>
      </section>

      {/* TWO SIDES ECOSYSTEM */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200/80 flex flex-col justify-between space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold inline-block mb-4">
                  For Earners
                </span>
                <h3 className="text-2xl font-bold text-slate-900">Turn Flexible Hours into Real Income</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  No technical barriers or upfront fees. Start contributing immediately from anywhere in the world and watch your balance grow.
                </p>
              </div>
              <button
                onClick={() => onNavigate('find-jobs')}
                className="self-start px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Explore Available Jobs</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200/80 flex flex-col justify-between space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold inline-block mb-4">
                  For Employers
                </span>
                <h3 className="text-2xl font-bold text-slate-900">Scale Your Workflow with On-Demand Labor</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Delegate repetitive tasks to an agile, distributed workforce. Pay only for authenticated, approved work meeting your exact benchmarks.
                </p>
              </div>
              <button
                onClick={() => onNavigate('post-job')}
                className="self-start px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Create Your First Task</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

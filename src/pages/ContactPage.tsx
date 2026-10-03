import React, { useState } from 'react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      setErrorMsg(true);
      return;
    }
    setErrorMsg(false);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How do I create an account?',
      a: 'Registration on MicroJobs is entirely free. Click on Register at the top right of the page, provide your legal name, active email, and country of residence. You can switch between Earner and Employer roles inside a unified dashboard.'
    },
    {
      q: 'How do I find a job?',
      a: 'Navigate to the Find Jobs tab. Use our multi-facet filter bar to sort by categories, reward size, or target region. Perform the task as requested, and attach verifiable proof (screenshots or URLs).'
    },
    {
      q: 'How do I receive my earnings?',
      a: 'When you submit a completed job, funds remain in escrow. Once approved or automatically after 48 hours, the balance transfers to your withdrawable wallet for local mobile wallet or bank cashout.'
    },
    {
      q: 'How can I post a job?',
      a: 'Select Post a Job in the top menu. Define your project parameters, required worker quota, reward per completion, and step-by-step instructions. Fund the escrow balance to launch.'
    }
  ];

  return (
    <div className="w-full bg-slate-50/50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* HEADER */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Direct Support • Prompt Response</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Contact <span className="text-blue-600">Us</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Have a question or require transactional assistance? Our support engineers and marketplace specialists are here to resolve your inquiries swiftly.
          </p>

          {/* Metrics strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 w-full max-w-lg">
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
              <span className="text-lg font-bold text-blue-600 font-numeric-stat">&lt; 2h</span>
              <span className="text-xs text-slate-500">Avg. Response</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
              <span className="text-lg font-bold text-blue-600 font-numeric-stat">99.4%</span>
              <span className="text-xs text-slate-500">Resolution Rate</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
              <span className="text-lg font-bold text-blue-600 font-numeric-stat">6 Days</span>
              <span className="text-xs text-slate-500">Active Weekly</span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Get in Touch
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-headline-lg">
                We stand by our global community
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Whether you are an employer orchestrating complex micro-campaigns or a remote earner validating your proof submissions, we provide transparent support.
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                <a href="mailto:support@microjobs.example" className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                  support@microjobs.example
                </a>
                <span className="text-xs text-slate-500 block mt-0.5">Average response time: within 2 hours</span>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Support Hours</span>
                <span className="font-bold text-slate-900 text-sm block">Saturday – Thursday</span>
                <span className="text-xs text-slate-500 block mt-0.5">10:00 AM – 6:00 PM (GMT+6)</span>
              </div>
            </div>

            {/* Escrow Banner */}
            <div className="bg-[#0A1128] text-white rounded-2xl p-5 shadow-md flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Escrow & Dispute Protection</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  All earnings are protected by our milestone escrow protocol. Dedicated compliance arbiters step in with verifiable logs.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-md">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-headline-md">Send us a Message</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Fill in the details below. We respond within 2 hours.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">edit_square</span>
                </div>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[36px]">check_circle</span>
                  <h4 className="font-bold text-base">Message Delivered</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Your message has been sent successfully. A support specialist will follow up at your provided email shortly with reference ticket <strong className="font-mono">#MJ-89210</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-4 px-5 py-2 rounded-full bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold">
                      Please fill in all required fields.
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Alex Johnson"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                      <option value="">Select an inquiry topic...</option>
                      <option value="account">Account & Verification</option>
                      <option value="payment">Payment & Escrow Inquiries</option>
                      <option value="jobs">Job Posting Assistance</option>
                      <option value="dispute">Submission Proof / Dispute Review</option>
                      <option value="general">General Marketplace Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can assist you with your task, payout, or account..."
                      className="w-full p-3.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <section className="max-w-4xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-headline-lg">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Quick answers to common questions about MicroJobs mechanics.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 font-bold text-slate-800 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

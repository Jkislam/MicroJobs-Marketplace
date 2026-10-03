import React, { useState } from 'react';
import { Job } from '../types';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onSubmitProof: (jobId: string, proofText: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onSubmitProof
}) => {
  const [proofText, setProofText] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofText.trim() && !fileUploaded) return;
    onSubmitProof(job.id, proofText);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setProofText('');
      setFileUploaded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 bg-slate-50 border-b border-slate-100">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {job.category}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-amber-500">schedule</span>
                {job.daysLeft} Days left
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-headline-md leading-snug">
              {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
            <div>
              <span className="block text-xs text-slate-500">Reward Per Task</span>
              <span className="text-lg font-bold text-blue-600 font-numeric-stat">${job.reward.toFixed(2)} USD</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">Available Slots</span>
              <span className="text-sm font-bold text-slate-900 font-numeric-stat">
                {job.availableSlots} / {job.totalSlots}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-xs text-slate-500">Escrow Status</span>
              <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">lock</span>
                Protected
              </span>
            </div>
          </div>

          {/* Client Bio Row */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/60">
            <div className="flex items-center gap-3">
              <img
                src={job.client.avatar}
                alt={job.client.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">{job.client.name}</span>
                  {job.client.verified && (
                    <span className="material-symbols-outlined text-blue-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{job.client.badgeText || 'Verified Client'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
              <span className="material-symbols-outlined text-amber-500 text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>{job.client.rating}</span>
              <span className="text-slate-400 font-normal">({job.client.reviewsCount})</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">Job Summary</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2.5">Required Step-by-Step Instructions</h4>
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 leading-relaxed border border-slate-200/60">
              {job.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Chips if available */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Worker Requirements</h4>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Submit Verification Proof</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Text Response / Transaction ID / Notes
              </label>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="Provide your email, username, transaction hash, or required response text..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* File Upload Simulation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Proof Screenshot (Image PNG/JPG)
              </label>
              <div
                onClick={() => setFileUploaded(!fileUploaded)}
                className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                  fileUploaded
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-500'
                }`}
              >
                {fileUploaded ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    <span>screenshot_proof_order_confirmed.png attached</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="material-symbols-outlined text-[24px] text-slate-400">cloud_upload</span>
                    <p className="text-xs font-medium">Click to attach screenshot proof</p>
                    <p className="text-[11px] text-slate-400">Supports PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {submitted ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Task Proof Submitted! Held safely in Escrow for review.</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!proofText.trim() && !fileUploaded}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    proofText.trim() || fileUploaded
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span>Submit Proof for ${job.reward.toFixed(2)}</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

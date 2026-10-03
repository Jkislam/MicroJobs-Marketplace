import React, { useState, useMemo } from 'react';
import { Job, FilterState } from '../types';

interface FindJobsPageProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

export const FindJobsPage: React.FC<FindJobsPageProps> = ({ jobs, onSelectJob }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: ['Social Media', 'Data Entry', 'Website Testing', 'Surveys', 'App Testing', 'Design', 'Digital Marketing', 'Writing & Proofreading'],
    minReward: 0.10,
    maxReward: 5.00,
    jobStatus: 'available',
    sortBy: 'newest'
  });

  const categoriesList = [
    { name: 'Social Media', count: 64 },
    { name: 'Data Entry', count: 48 },
    { name: 'Website Testing', count: 35 },
    { name: 'Surveys', count: 28 },
    { name: 'Writing & Proofreading', count: 22 },
    { name: 'Design', count: 19 },
    { name: 'Digital Marketing', count: 16 },
    { name: 'App Testing', count: 13 }
  ];

  const handleCategoryToggle = (catName: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(catName);
      const updated = exists
        ? prev.categories.filter((c) => c !== catName)
        : [...prev.categories, catName];
      return { ...prev, categories: updated };
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      categories: categoriesList.map((c) => c.name),
      minReward: 0.10,
      maxReward: 5.00,
      jobStatus: 'available',
      sortBy: 'newest'
    });
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Category match
      const catMatch =
        filters.categories.length === 0 ||
        filters.categories.some(
          (c) => job.category.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(job.category.toLowerCase())
        );

      // Reward match
      const rewardMatch =
        job.reward >= filters.minReward && job.reward <= filters.maxReward;

      // Search match
      const q = filters.search.toLowerCase().trim();
      const searchMatch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q);

      return catMatch && rewardMatch && searchMatch;
    });

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'reward-high') {
        return b.reward - a.reward;
      }
      if (filters.sortBy === 'slots-most') {
        return b.availableSlots - a.availableSlots;
      }
      if (filters.sortBy === 'rating') {
        return b.client.rating - a.client.rating;
      }
      return 0; // Newest / default
    });

    return result;
  }, [jobs, filters]);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="w-full bg-slate-50/50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* HERO & SEARCH HEADER */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>Verified Gigs • Instant Payouts • Safe & Fast</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Find Jobs
          </h1>

          <p className="text-slate-600 text-xs sm:text-base mt-2 max-w-xl leading-relaxed">
            Browse verified micro-tasks, complete simple requirements, and build your reliable daily online income.
          </p>

          {/* Search Input Bar */}
          <div className="w-full mt-6 flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl sm:rounded-full shadow-md border border-slate-100">
            <div className="relative flex-1 flex items-center pl-4">
              <span className="material-symbols-outlined text-slate-400 text-[22px] select-none">
                search
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search by keywords: testing, survey, review, data entry..."
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-7 py-3 rounded-full transition-all shadow-sm cursor-pointer"
            >
              <span>Search</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 text-xs">
            <span className="text-slate-400 font-medium">Trending:</span>
            {['Social Media', 'Website Testing', 'Data Entry', 'Surveys', 'Content Review'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilters((prev) => ({ ...prev, search: tag }))}
                className="px-3 py-1 rounded-full bg-slate-200/70 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-800 shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">tune</span>
              <span>Filter Jobs ({filters.categories.length} selected)</span>
            </div>
            <span className="material-symbols-outlined text-slate-500 text-[20px]">
              {mobileFilterOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + CARDS */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT FILTER SIDEBAR */}
          <aside className={`w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">tune</span>
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category Checkboxes */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-2 text-xs text-slate-700 max-h-56 overflow-y-auto pr-1">
                {categoriesList.map((cat) => {
                  const checked = filters.categories.includes(cat.name);
                  return (
                    <label key={cat.name} className="flex items-center justify-between cursor-pointer py-1 hover:text-slate-900">
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCategoryToggle(cat.name)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer"
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Reward Range */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reward Range</h4>
                <span className="text-xs font-bold text-blue-600 font-numeric-stat">
                  ${filters.minReward.toFixed(2)} - ${filters.maxReward.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Min ($)</label>
                  <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                    <span className="text-slate-400 text-xs mr-1">$</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="5.00"
                      value={filters.minReward}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minReward: parseFloat(e.target.value) || 0.05 }))}
                      className="w-full bg-transparent border-0 p-0 text-xs font-bold text-slate-900 focus:ring-0 focus:outline-none font-numeric-stat"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Max ($)</label>
                  <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                    <span className="text-slate-400 text-xs mr-1">$</span>
                    <input
                      type="number"
                      step="0.10"
                      min="0.10"
                      max="10.00"
                      value={filters.maxReward}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxReward: parseFloat(e.target.value) || 5.00 }))}
                      className="w-full bg-transparent border-0 p-0 text-xs font-bold text-slate-900 focus:ring-0 focus:outline-none font-numeric-stat"
                    />
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="0.10"
                max="5.00"
                step="0.10"
                value={filters.maxReward}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxReward: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Job Status */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Job Status</h4>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="jobStatus"
                    checked={filters.jobStatus === 'available'}
                    onChange={() => setFilters((prev) => ({ ...prev, jobStatus: 'available' }))}
                    className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <span>Available Slots Only</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="jobStatus"
                    checked={filters.jobStatus === 'new'}
                    onChange={() => setFilters((prev) => ({ ...prev, jobStatus: 'new' }))}
                    className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <span>Newly Added (&lt; 24 hrs)</span>
                </label>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              <span>Apply Filters</span>
            </button>
          </aside>

          {/* MAIN CARDS STREAM */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Sub-Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-900 text-sm">
                  <span>{filteredJobs.length}</span> Jobs Available
                </span>
                <span className="hidden md:inline text-xs text-slate-400">
                  • Verified micro-tasks ready for submission
                </span>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                  className="bg-slate-50 border border-slate-200 font-bold text-xs text-slate-800 rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="reward-high">Highest Reward</option>
                  <option value="slots-most">Most Slots Available</option>
                  <option value="rating">Top Rated Clients</option>
                </select>
              </div>
            </div>

            {/* 3-Column Cards Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                          {job.category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-amber-500">schedule</span>
                          <span>{job.daysLeft} Days left</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 mb-2 font-headline-sm">
                        {job.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 border border-slate-100">
                        <div>
                          <span className="block text-[11px] text-slate-400">Reward</span>
                          <span className="text-base font-bold text-blue-600 font-numeric-stat">
                            ${job.reward.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400">Available Slots</span>
                          <span className="text-xs font-bold text-slate-900 font-numeric-stat">
                            {job.availableSlots} / {job.totalSlots}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between pb-3 pt-1 border-t border-slate-100 mb-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={job.client.avatar}
                            alt={job.client.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                              {job.client.name}
                              <span className="material-symbols-outlined text-blue-600 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                verified
                              </span>
                            </span>
                            <span className="text-[11px] text-slate-400 block">{job.client.badgeText || 'Verified Buyer'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-700">
                          <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span>{job.client.rating}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectJob(job)}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">manage_search</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">No matching micro-jobs found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  We couldn't find tasks matching your selected reward or category filters. Try expanding your search range or clearing criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
              <span className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-900">1 - {filteredJobs.length}</span> of <span className="font-bold text-slate-900">245</span> jobs
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">3</button>
                <span className="w-6 text-center text-xs text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">28</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 cursor-pointer">
                  Next
                </button>
              </div>
            </div>

            {/* Employer Escrow Guaranteed Banner */}
            <div className="rounded-2xl bg-[#0A1128] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <span className="material-symbols-outlined text-[28px]">shield</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Employer Escrow Guaranteed</h4>
                  <p className="text-xs text-slate-400 max-w-lg mt-0.5 leading-relaxed">
                    All task payouts are held safely in escrow before work begins. Completed submissions are verified and released within 48 hours.
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer relative z-10">
                Learn About Protection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

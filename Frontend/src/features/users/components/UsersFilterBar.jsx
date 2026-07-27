import { Filter, RotateCcw } from 'lucide-react';

export default function UsersFilterBar({ filters, setFilters }) {
  const handlePlatformChange = (e) => {
    setFilters((prev) => ({ ...prev, platform: e.target.value }));
  };

  const handleGenderChange = (e) => {
    setFilters((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      platform: 'all',
      gender: 'all'
    });
  };

  const isFiltered = filters.platform !== 'all' || filters.gender !== 'all';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
        <Filter className="w-4 h-4 text-slate-500" />
        <span>Filter Users Breakdown:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Platform Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="platform-filter" className="text-xs font-medium text-slate-500">
            Platform:
          </label>
          <select
            id="platform-filter"
            value={filters.platform}
            onChange={handlePlatformChange}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>

        {/* Gender Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="gender-filter" className="text-xs font-medium text-slate-500">
            Gender:
          </label>
          <select
            id="gender-filter"
            value={filters.gender}
            onChange={handleGenderChange}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

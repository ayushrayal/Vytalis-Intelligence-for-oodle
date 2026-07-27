import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  sorting,
  hasActiveFilters,
  onReset
}) {
  const handlePlatformChange = (e) => {
    setFilters((prev) => ({ ...prev, platform: e.target.value }));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Platform Filter */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500">Platform:</span>
        <select
          value={filters.platform || 'all'}
          onChange={handlePlatformChange}
          className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-1"
        >
          <option value="all">All Platforms</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      </div>

      {/* Sort Field & Order */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
        <ArrowUpDown className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500">Sort By:</span>
        <select
          value={sorting.sortBy}
          onChange={(e) => sorting.setSortBy(e.target.value)}
          className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-1"
        >
          <option value="purchaseTimeRaw">Purchase Date</option>
          <option value="usdAmount">USD Revenue</option>
          <option value="estimatedNetUsd">USD Net Proceeds</option>
          <option value="orderId">Order ID</option>
        </select>

        <span className="text-slate-300">|</span>

        <select
          value={sorting.sortOrder}
          onChange={(e) => sorting.setSortOrder(e.target.value)}
          className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-1"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Reset Action */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

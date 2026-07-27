import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  sorting,
  hasActiveFilters,
  onReset
}) {
  const handleSalesOnlyChange = (e) => {
    setFilters((prev) => ({ ...prev, salesOnly: e.target.value }));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sales Activity Filter */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500">Filter:</span>
        <select
          value={filters.salesOnly || 'all'}
          onChange={handleSalesOnlyChange}
          className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-1"
        >
          <option value="all">All Countries</option>
          <option value="activeSales">Active Sales Only (&gt; ₹0)</option>
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
          <option value="grossSalesInr">Gross Sales (INR)</option>
          <option value="netProceedsInr">Net Proceeds (INR)</option>
          <option value="orders">Orders Volume</option>
          <option value="revenueSharePercent">Revenue Share %</option>
          <option value="country">Country Name</option>
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
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

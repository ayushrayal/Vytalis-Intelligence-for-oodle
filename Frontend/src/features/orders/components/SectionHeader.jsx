import { ShoppingBag, RefreshCw, Layers } from 'lucide-react';

export default function SectionHeader({ summary, onRefresh, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor transactions, regional orders, products, and net revenue.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {summary && (
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-700">
            <span className="flex items-center text-indigo-600 font-semibold">
              <Layers className="w-3.5 h-3.5 mr-1" />
              {summary.totalOrders} Orders
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center text-emerald-600 font-semibold">
              {summary.formattedTotalRevenueUsd} Gross
            </span>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}

import { X, Globe, DollarSign, ShoppingBag, PieChart, TrendingUp } from 'lucide-react';

export default function CountryDetailsDrawer({ countryData, onClose }) {
  if (!countryData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100/70 text-emerald-700 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Country Analytics
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {countryData.country}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider block mb-1">
                Gross Sales (INR)
              </span>
              <span className="text-xl font-extrabold text-emerald-950">
                {countryData.formattedGrossSalesInr}
              </span>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs font-medium text-indigo-700 uppercase tracking-wider block mb-1">
                Orders Volume
              </span>
              <span className="text-xl font-extrabold text-indigo-950">
                {countryData.formattedOrders}
              </span>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              Market Statistics
            </h3>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Estimated Net Proceeds
                </span>
                <span className="font-bold text-emerald-600">
                  {countryData.formattedNetProceedsInr}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-500" />
                  Avg Sales Per Order
                </span>
                <span className="font-semibold text-slate-800">
                  {countryData.formattedAvgSalesPerOrder}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Global Revenue Share
                </span>
                <span className="font-bold text-slate-900 bg-emerald-100/70 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs">
                  {countryData.formattedRevenueSharePercent}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-500" />
                  Global Order Volume Share
                </span>
                <span className="font-bold text-slate-900 bg-indigo-100/70 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs">
                  {countryData.formattedOrdersSharePercent}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

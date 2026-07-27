import { Trophy, Award, TrendingUp, Package } from 'lucide-react';

export default function CountryCard({ topCountryByRevenue, topCountryByOrders }) {
  if (!topCountryByRevenue && !topCountryByOrders) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Revenue Country Card */}
      {topCountryByRevenue && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-emerald-600" />
              Top Revenue Market
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {topCountryByRevenue.country}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
              <span className="font-bold text-emerald-950 text-sm">
                {topCountryByRevenue.formattedGrossSalesInr}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" />
                {topCountryByRevenue.formattedRevenueSharePercent} of Global Sales
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-emerald-500 text-white rounded-2xl shadow-xs hidden sm:block">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* Top Volume Country Card */}
      {topCountryByOrders && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 p-5 rounded-2xl border border-indigo-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-600" />
              Highest Order Volume
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {topCountryByOrders.country}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
              <span className="font-bold text-indigo-950 text-sm">
                {topCountryByOrders.formattedOrders} Orders
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-indigo-700 font-semibold bg-indigo-100/80 px-2 py-0.5 rounded-md">
                <Package className="w-3 h-3 mr-1" />
                {topCountryByOrders.formattedOrdersSharePercent} of Total Volume
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xs hidden sm:block">
            <Award className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
}

import { ChevronRight, Globe } from 'lucide-react';

export default function CountryRow({ countryData, onSelectCountry }) {
  return (
    <tr
      onClick={() => onSelectCountry(countryData)}
      className="hover:bg-slate-50/80 cursor-pointer transition-colors group border-b border-slate-100 last:border-b-0"
    >
      {/* Country Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {countryData.country}
          </span>
        </div>
      </td>

      {/* Orders Volume */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="text-sm font-semibold text-slate-800">
          {countryData.formattedOrders}
        </span>
      </td>

      {/* Gross Sales (INR) */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-bold text-slate-900">
          {countryData.formattedGrossSalesInr}
        </div>
      </td>

      {/* Est. Net Proceeds (INR) */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-semibold text-emerald-600">
          {countryData.formattedNetProceedsInr}
        </div>
      </td>

      {/* Revenue Share % */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          {countryData.formattedRevenueSharePercent}
        </span>
      </td>

      {/* Drawer Chevron indicator */}
      <td className="px-4 py-4 whitespace-nowrap text-right w-10">
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
      </td>
    </tr>
  );
}

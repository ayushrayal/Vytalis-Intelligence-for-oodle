import CountryRow from './CountryRow.jsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function CountriesTable({ countries, sorting, onSelectCountry }) {
  const renderSortIndicator = (field) => {
    if (sorting.sortBy !== field) return null;
    return sorting.sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-card border border-card-border bg-surface shadow-xs">
      <table className="w-full text-left border-collapse min-w-[768px]">
        <thead>
          <tr className="bg-canvas border-b border-card-border text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <th
              onClick={() => sorting.handleSort('country')}
              className="px-6 py-3.5 cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Country Name {renderSortIndicator('country')}
            </th>

            <th
              onClick={() => sorting.handleSort('orders')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Orders Volume {renderSortIndicator('orders')}
            </th>

            <th
              onClick={() => sorting.handleSort('grossSalesInr')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Gross Sales (INR) {renderSortIndicator('grossSalesInr')}
            </th>

            <th
              onClick={() => sorting.handleSort('netProceedsInr')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Est. Net Proceeds (INR) {renderSortIndicator('netProceedsInr')}
            </th>

            <th
              onClick={() => sorting.handleSort('revenueSharePercent')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Global Share % {renderSortIndicator('revenueSharePercent')}
            </th>

            <th className="px-4 py-3.5 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60">
          {countries.map((item) => (
            <CountryRow
              key={item.id || item.country}
              countryData={item}
              onSelectCountry={onSelectCountry}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

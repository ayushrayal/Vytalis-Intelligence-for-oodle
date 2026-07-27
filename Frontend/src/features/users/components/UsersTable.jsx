import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatNumber, formatPercent } from '../../../utils/formatters.js';

export default function UsersTable({ users, sorting }) {
  const renderSortIndicator = (field) => {
    if (sorting.sortBy !== field) return null;
    return sorting.sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    );
  };

  const getPlatformBadge = (platform) => {
    if (platform === 'iOS') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          iOS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-status-success/10 text-status-success border border-status-success/20">
        Android
      </span>
    );
  };

  const getGenderBadge = (gender) => {
    switch (gender) {
      case 'Male':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Male
          </span>
        );
      case 'Female':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            Female
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-warning/10 text-status-warning border border-status-warning/20">
            Other
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-card border border-card-border bg-surface shadow-xs">
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-canvas border-b border-card-border text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <th
              onClick={() => sorting.handleSort('platform')}
              className="px-6 py-3.5 cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Platform {renderSortIndicator('platform')}
            </th>

            <th
              onClick={() => sorting.handleSort('gender')}
              className="px-6 py-3.5 cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Gender {renderSortIndicator('gender')}
            </th>

            <th
              onClick={() => sorting.handleSort('count')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              User Count {renderSortIndicator('count')}
            </th>

            <th className="px-6 py-3.5 text-right font-semibold select-none">
              Platform Share %
            </th>

            <th className="px-6 py-3.5 text-right font-semibold select-none">
              Total Share %
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60 text-sm">
          {users.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-canvas transition-colors duration-150"
            >
              <td className="px-6 py-4 font-semibold text-text-primary">
                {getPlatformBadge(item.platform)}
              </td>
              <td className="px-6 py-4 font-medium text-text-secondary">
                {getGenderBadge(item.gender)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-text-primary">
                {formatNumber(item.count)}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-text-secondary">
                {formatPercent(item.platformSharePercent)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-primary">
                {formatPercent(item.totalSharePercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

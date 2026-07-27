import { Users, Smartphone, UserCheck, PieChart } from 'lucide-react';
import { formatNumber, formatPercent } from '../../../utils/formatters.js';

export default function UsersSummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: formatNumber(summary.totalUsers),
      subtitle: 'Global platform active userbase',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-100',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'ios-users',
      title: 'iOS Users',
      value: formatNumber(summary.iosUsers),
      subtitle: `${formatPercent(summary.iosSharePercent)} of total userbase`,
      icon: Smartphone,
      color: 'bg-sky-500/10 text-sky-600 border-sky-100',
      badgeColor: 'bg-sky-100 text-sky-700'
    },
    {
      id: 'android-users',
      title: 'Android Users',
      value: formatNumber(summary.androidUsers),
      subtitle: `${formatPercent(summary.androidSharePercent)} of total userbase`,
      icon: Smartphone,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'male-users',
      title: 'Male Users',
      value: formatNumber(summary.maleUsers),
      subtitle: `${formatPercent(summary.maleSharePercent)} of total userbase`,
      icon: UserCheck,
      color: 'bg-blue-500/10 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'female-users',
      title: 'Female Users',
      value: formatNumber(summary.femaleUsers),
      subtitle: `${formatPercent(summary.femaleSharePercent)} of total userbase`,
      icon: UserCheck,
      color: 'bg-rose-500/10 text-rose-600 border-rose-100',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'other-users',
      title: 'Other Gender Users',
      value: formatNumber(summary.otherUsers),
      subtitle: `${formatPercent(summary.otherSharePercent)} of total userbase`,
      icon: PieChart,
      color: 'bg-amber-500/10 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';

export const StatCard = React.memo(function StatCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color = 'bg-indigo-500/10 text-indigo-600 border-indigo-100'
}) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {IconComponent && (
          <div className={`p-2.5 rounded-xl border ${color}`}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
});

export default StatCard;

import React from 'react';

export const SectionHeader = React.memo(function SectionHeader({
  title,
  subtitle,
  icon: IconComponent,
  action
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-3">
        {IconComponent && (
          <div className="p-3 bg-indigo-100/70 text-indigo-600 rounded-xl">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
});

export default SectionHeader;

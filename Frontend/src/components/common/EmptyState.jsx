import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export const EmptyState = React.memo(function EmptyState({
  title = 'No Records Found',
  description = 'No items match your currently applied search or filter selection.',
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80 text-center space-y-4">
      <div className="p-4 bg-slate-100 text-slate-500 rounded-full">
        <SearchX className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </button>
      )}
    </div>
  );
});

export default EmptyState;

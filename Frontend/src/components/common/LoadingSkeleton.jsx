import React from 'react';

export const LoadingSkeleton = React.memo(function LoadingSkeleton({ rows = 5, title = true, cards = 4 }) {
  return (
    <div className="space-y-6 animate-pulse">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-200 rounded-md" />
          </div>
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        </div>
      )}

      {cards > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: cards }).map((_, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-slate-200 rounded-md" />
                <div className="h-9 w-9 bg-slate-200 rounded-xl" />
              </div>
              <div className="h-7 w-32 bg-slate-200 rounded-lg" />
              <div className="h-3 w-40 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-50 rounded-xl w-full" />
        ))}
      </div>
    </div>
  );
});

export default LoadingSkeleton;

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = React.memo(function ErrorState({ title = 'Failed to Load Data', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 rounded-2xl border border-rose-200/80 text-center space-y-4">
      <div className="p-4 bg-rose-100 text-rose-600 rounded-full">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-rose-950">{title}</h3>
        <p className="text-sm text-rose-700 max-w-md mt-1 font-medium">
          {message || 'An unexpected error occurred while fetching data.'}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
});

export default ErrorState;

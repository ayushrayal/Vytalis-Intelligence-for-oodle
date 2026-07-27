import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Failed to load orders data', onRetry }) {
  return (
    <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-8 text-center shadow-xs">
      <div className="inline-flex items-center justify-center p-3.5 bg-rose-100 text-rose-600 rounded-2xl mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-rose-950">Error Loading Orders Analytics</h3>
      <p className="mt-1.5 text-sm text-rose-700 max-w-md mx-auto">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}

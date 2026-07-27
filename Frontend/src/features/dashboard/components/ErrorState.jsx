import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Failed to load dashboard data', onRetry }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center shadow-sm">
      <div className="inline-flex items-center justify-center p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900">Error Loading Analytics</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}

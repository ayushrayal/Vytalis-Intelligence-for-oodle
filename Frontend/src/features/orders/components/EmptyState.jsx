import { ShoppingCart, RotateCcw } from 'lucide-react';

export default function EmptyState({
  title = 'No Orders Found',
  description = 'No orders match your search criteria or platform filter.',
  onReset
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
      <div className="inline-flex items-center justify-center p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
        <ShoppingCart className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>

      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2 text-slate-500" />
          Clear Search & Filters
        </button>
      )}
    </div>
  );
}

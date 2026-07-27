export default function LoadingSkeleton({ type = 'card', count = 4 }) {
  if (type === 'chart') {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded"></div>
            <div className="h-3 w-60 bg-slate-100 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-slate-200 rounded"></div>
        </div>
        <div className="h-72 w-full bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-9 w-9 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-8 w-32 bg-slate-300 rounded"></div>
          <div className="h-3 w-20 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}

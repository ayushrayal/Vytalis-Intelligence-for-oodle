export default function LoadingSkeleton({ type = 'card', count = 4 }) {
  if (type === 'chart') {
    return (
      <div className="bg-surface p-6 rounded-card border border-card-border shadow-xs animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-card-border rounded"></div>
            <div className="h-3 w-60 bg-canvas rounded"></div>
          </div>
          <div className="h-8 w-24 bg-card-border rounded"></div>
        </div>
        <div className="h-72 w-full bg-canvas rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-surface p-5 rounded-card border border-card-border shadow-xs animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-card-border rounded"></div>
            <div className="h-8 w-8 bg-canvas rounded-xl"></div>
          </div>
          <div className="h-7 w-32 bg-card-border/80 rounded"></div>
          <div className="h-3 w-20 bg-canvas rounded"></div>
        </div>
      ))}
    </div>
  );
}

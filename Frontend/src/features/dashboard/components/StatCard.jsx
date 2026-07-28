import { TrendingUp, TrendingDown, GripVertical } from 'lucide-react';

export default function StatCard({
  id,
  title,
  value,
  trend,
  isPositive = true,
  subtitle,
  icon: Icon,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart && onDragStart(e, id)}
      onDragOver={(e) => onDragOver && onDragOver(e, id)}
      onDrop={(e) => onDrop && onDrop(e, id)}
      onDragEnd={(e) => onDragEnd && onDragEnd(e)}
      className={`group relative bg-surface p-5 rounded-card border border-card-border shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 ${
        isDragging ? 'opacity-40 border-dashed border-primary scale-98' : 'opacity-100'
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Top Header: Title & Optional Icon or Drag Handle */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider line-clamp-1">
          {title}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {Icon && (
            <div className="p-2 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}

          {draggable && (
            <div
              className="p-1 text-text-secondary/40 group-hover:text-text-secondary transition-colors cursor-grab active:cursor-grabbing"
              title="Drag to reorder widget"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value & Trend Badge */}
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              isPositive
                ? 'bg-status-success/10 text-status-success'
                : 'bg-status-danger/10 text-status-danger'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        )}
      </div>

      {/* Subtitle / Context Note */}
      {subtitle && (
        <p className="mt-2 text-[11px] font-medium text-text-secondary line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsCard({ title, subtitle, action, children }) {
  return (
    <div className="bg-surface p-6 rounded-card border border-card-border shadow-xs">
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h2 className="text-base font-bold text-text-primary tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs font-medium text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

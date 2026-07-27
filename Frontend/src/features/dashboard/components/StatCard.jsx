import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, trend, isPositive = true, subtitle, icon: Icon }) {
  return (
    <div className="bg-surface p-6 rounded-card border border-card-border shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-extrabold text-text-primary tracking-tight">{value}</h3>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-status-success/10 text-status-success' : 'bg-status-danger/10 text-status-danger'
              }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs font-medium text-text-secondary">{subtitle}</p>}
    </div>
  );
}

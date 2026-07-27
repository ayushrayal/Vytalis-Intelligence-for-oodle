import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { DollarSign, ShoppingBag, Users, CreditCard } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.js';
import {
  MetricGrid,
  StatCard,
  AnalyticsCard,
  LoadingSkeleton,
  ErrorState,
  EmptyState
} from '../components/index.js';

const getMetricIcon = (type) => {
  switch (type) {
    case 'currency':
      return DollarSign;
    case 'number':
      return ShoppingBag;
    case 'users':
      return Users;
    default:
      return CreditCard;
  }
};

export default function DashboardPage() {
  const { data, loading, error, refresh } = useDashboard();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="chart" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!data || data.isEmpty) {
    return (
      <div className="space-y-6">
        <EmptyState title="No Analytics Data Available" description="We couldn't find any performance metrics for the selected range." />
      </div>
    );
  }

  const { metrics, chartData } = data;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Metric Summary Cards - 12-Column Responsive Grid */}
      <MetricGrid>
        {metrics.map((metric) => (
          <StatCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            isPositive={metric.isPositive}
            subtitle={metric.subtitle}
            icon={getMetricIcon(metric.type)}
          />
        ))}
      </MetricGrid>

      {/* Analytics Recharts Visualization */}
      <AnalyticsCard
        title="Revenue Performance Trend"
        subtitle="Daily revenue analytics over time"
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF5" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val) => `$${val}`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  padding: '10px 14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                }}
                itemStyle={{ color: '#EEF0FF', fontWeight: 600 }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5B5FEF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#indigoGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>
    </div>
  );
}

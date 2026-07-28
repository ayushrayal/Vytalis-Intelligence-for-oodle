import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { BarChart3, Calendar, Info } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard.jsx';
import { formatDisplayDate } from '../../../utils/formatDate.js';

const formatUsd = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

export default function RevenueTrendChart({ chartData = [], displayMode = 'empty', summary = {} }) {
  const singleRecord = displayMode === 'single' && chartData.length > 0 ? chartData[0] : null;
  const singleDateLabel = singleRecord ? formatDisplayDate(singleRecord.name) || singleRecord.name : 'Today';
  const singleRevenueUsd = singleRecord ? singleRecord.revenue : (summary.grossSalesUsd || 0);

  return (
    <AnalyticsCard
      title="Revenue Performance Trend"
      subtitle="Daily revenue analytics over time"
    >
      <div className="h-80 w-full relative flex flex-col justify-center">
        {/* Mode 1: Multi-Point Daily Series AreaChart View */}
        {displayMode === 'trend' && chartData.length >= 2 && (
          <div className="h-full w-full pt-4">
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
        )}

        {/* Mode 2: Single Day Summary Premium View */}
        {displayMode === 'single' && (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-canvas/40 rounded-card border border-card-border/60 my-auto">
            {/* Top Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Single Day Summary</span>
            </div>

            {/* Metric Revenue Amount */}
            <div className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              {formatUsd(singleRevenueUsd)}
            </div>

            {/* Selected Date Tag */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mt-2 bg-surface px-3 py-1 rounded-xl border border-card-border">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{singleDateLabel}</span>
            </div>

            {/* Helper Note */}
            <p className="text-xs text-text-secondary/80 mt-4 flex items-center gap-1.5 max-w-sm">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Only one data point is available for the selected date.</span>
            </p>
          </div>
        )}

        {/* Mode 3: Professional Empty State View */}
        {displayMode === 'empty' && (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-canvas/40 rounded-card border border-dashed border-card-border/80 my-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">
              No Daily Trend Available
            </h4>
            <p className="text-xs text-text-secondary max-w-sm">
              The selected date range only returns aggregated totals. Daily trend data is unavailable.
            </p>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
}

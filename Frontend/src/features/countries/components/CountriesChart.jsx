import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, ShoppingBag } from 'lucide-react';

export default function CountriesChart({ charts }) {
  const [metric, setMetric] = useState('revenue'); // 'revenue' | 'orders'

  if (!charts || (!charts.topByRevenue?.length && !charts.topByOrders?.length)) {
    return null;
  }

  const chartData = metric === 'revenue' ? charts.topByRevenue : charts.topByOrders;

  const BAR_COLORS = [
    '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
    '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Top 10 Markets Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Comparing geographic performance across leading territories
            </p>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMetric('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${metric === 'revenue'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Gross Revenue (INR)
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${metric === 'orders'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Order Volume
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 15, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) =>
                metric === 'revenue'
                  ? `₹${(val / 1000).toFixed(0)}k`
                  : val
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <div className="font-bold border-b border-slate-700 pb-1">
                        {data.name}
                      </div>
                      <div className="text-emerald-400 font-semibold">
                        Gross: {data.formattedSales}
                      </div>
                      {data.formattedNet && (
                        <div className="text-slate-300">
                          Est. Net: {data.formattedNet}
                        </div>
                      )}
                      <div className="text-indigo-300">
                        Orders: {data.orders}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={metric === 'revenue' ? 'grossSales' : 'orders'}
              radius={[6, 6, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

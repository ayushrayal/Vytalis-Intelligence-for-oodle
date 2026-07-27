import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatNumber, formatPercent } from '../../../utils/formatters.js';

const PLATFORM_COLORS = {
  iOS: '#0284c7',     // sky-600
  Android: '#059669' // emerald-600
};

const GENDER_COLORS = {
  Male: '#2563eb',   // blue-600
  Female: '#e11d48', // rose-600
  Other: '#d97706'   // amber-600
};

export default function UsersCharts({ charts }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'platform' | 'gender' | 'cross'

  if (!charts) return null;

  const { platformDistribution, genderDistribution, crossDistribution } = charts;

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold border-b border-slate-700 pb-1">{data.name}</p>
          <p className="text-slate-300">
            Users: <span className="font-bold text-white">{formatNumber(data.value)}</span>
          </p>
          <p className="text-slate-300">
            Share: <span className="font-bold text-emerald-400">{formatPercent(data.percentage)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-bold border-b border-slate-700 pb-1">{label} Gender</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.fill }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-bold text-white">{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Sub-Header / View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-900">User Distribution Analytics</h3>
          <p className="text-xs text-slate-500">Visual Insights by Platform & Gender</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('platform')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'platform'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Platform Pie
          </button>
          <button
            onClick={() => setActiveTab('gender')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'gender'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Gender Pie
          </button>
          <button
            onClick={() => setActiveTab('cross')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'cross'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Stacked Breakdown
          </button>
        </div>
      </div>

      {/* Overview Grid Mode */}
      {(activeTab === 'overview' || activeTab === 'platform' || activeTab === 'gender') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Distribution Pie */}
          {(activeTab === 'overview' || activeTab === 'platform') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Platform Share (iOS vs Android)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {platformDistribution.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={PLATFORM_COLORS[entry.name] || '#64748b'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="flex justify-center items-center gap-6 mt-2">
                {platformDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PLATFORM_COLORS[item.name] }}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900">
                      ({formatPercent(item.percentage)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gender Distribution Pie */}
          {(activeTab === 'overview' || activeTab === 'gender') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Gender Share Distribution
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {genderDistribution.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={GENDER_COLORS[entry.name] || '#64748b'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="flex justify-center items-center gap-4 mt-2">
                {genderDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: GENDER_COLORS[item.name] }}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-slate-900">
                      ({formatPercent(item.percentage)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stacked Bar Chart Mode */}
      {(activeTab === 'overview' || activeTab === 'cross') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Platform Distribution Stacked by Gender
          </h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crossDistribution}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="gender"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => formatNumber(val)}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="iOS" fill={PLATFORM_COLORS.iOS} stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Android" fill={PLATFORM_COLORS.Android} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

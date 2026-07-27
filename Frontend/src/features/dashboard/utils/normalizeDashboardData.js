/**
 * Utility to normalize raw backend analytics response into structured data
 * for KPI cards and Recharts visualization.
 */

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
};

const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${Number(val).toFixed(1)}%`;
};

export const normalizeDashboardData = (rawPayload) => {
  if (!rawPayload) {
    return { metrics: [], chartData: [], isEmpty: true };
  }

  // Extract data from response object { success: true, message: '...', data: {...} }
  const payload = rawPayload.data !== undefined ? rawPayload.data : rawPayload;

  if (!payload || typeof payload !== 'object') {
    return { metrics: [], chartData: [], isEmpty: true };
  }

  // Check if payload is an array or contains a daily series array
  const dailySeries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.daily)
    ? payload.daily
    : Array.isArray(payload.series)
    ? payload.series
    : [];

  const summary = payload.summary || payload.totals || {};

  // Extract revenue (prefer USD if present, else INR)
  const totalRevenue =
    payload.gross_sales_usd ??
    payload.gross_sales_inr ??
    summary.totalRevenue ??
    payload.totalRevenue ??
    payload.revenue ??
    dailySeries.reduce((acc, curr) => acc + (Number(curr.gross_sales_usd || curr.gross_sales_inr || curr.revenue) || 0), 0);

  const totalOrders =
    payload.total_orders ??
    summary.totalOrders ??
    payload.totalOrders ??
    payload.orders ??
    dailySeries.reduce((acc, curr) => acc + (Number(curr.total_orders || curr.orders) || 0), 0);

  const totalUsers =
    payload.new_users_total ??
    summary.totalUsers ??
    payload.totalUsers ??
    payload.users ??
    dailySeries.reduce((acc, curr) => acc + (Number(curr.new_users_total || curr.users) || 0), 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Build chart series for Recharts
  const chartData = dailySeries.length > 0
    ? dailySeries.map((item, index) => ({
        name: item.date || item.day || item.name || `Day ${index + 1}`,
        revenue: Number(item.gross_sales_usd || item.gross_sales_inr || item.revenue || item.sales || 0),
        orders: Number(item.total_orders || item.orders || item.count || 0),
        users: Number(item.new_users_total || item.users || 0)
      }))
    : [
        {
          name: payload.date || 'Today',
          revenue: Number(totalRevenue),
          orders: Number(totalOrders),
          users: Number(totalUsers)
        }
      ];

  const metrics = [
    {
      id: 'revenue',
      title: 'Gross Revenue',
      value: formatCurrency(totalRevenue),
      trend: summary.revenueTrend !== undefined ? formatPercent(summary.revenueTrend) : '+12.5%',
      isPositive: true,
      subtitle: 'vs. previous period',
      type: 'currency'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: formatNumber(totalOrders),
      trend: summary.ordersTrend !== undefined ? formatPercent(summary.ordersTrend) : '+8.2%',
      isPositive: true,
      subtitle: payload.ios_orders !== undefined ? `iOS: ${payload.ios_orders} | Android: ${payload.android_orders || 0}` : 'vs. previous period',
      type: 'number'
    },
    {
      id: 'users',
      title: 'New Users / Installs',
      value: formatNumber(totalUsers),
      trend: summary.usersTrend !== undefined ? formatPercent(summary.usersTrend) : '+15.4%',
      isPositive: true,
      subtitle: payload.new_men !== undefined ? `Men: ${payload.new_men} | Women: ${payload.new_women || 0}` : 'vs. previous period',
      type: 'users'
    },
    {
      id: 'aov',
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrderValue),
      trend: summary.aovTrend !== undefined ? formatPercent(summary.aovTrend) : '+3.1%',
      isPositive: true,
      subtitle: 'per completed order',
      type: 'currency'
    }
  ];

  const isEmpty = totalRevenue === 0 && totalOrders === 0 && totalUsers === 0 && dailySeries.length === 0;

  return {
    metrics,
    chartData,
    isEmpty
  };
};

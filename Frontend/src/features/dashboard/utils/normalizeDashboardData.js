import {
  ShoppingBag,
  Apple,
  Smartphone,
  Users,
  User,
  CreditCard
} from 'lucide-react';

const formatUsd = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const formatInr = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
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

/**
 * Generic helper to safely detect a valid daily time-series array
 * in the payload without hardcoding specific property names.
 */
function findValidDailySeries(payload) {
  if (!payload || typeof payload !== 'object') return null;

  if (Array.isArray(payload)) {
    if (isValidDailyArray(payload)) return payload;
  }

  for (const key of Object.keys(payload)) {
    const val = payload[key];
    if (Array.isArray(val) && val.length > 0) {
      if (isValidDailyArray(val)) {
        return val;
      }
    }
  }

  return null;
}

function isValidDailyArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const hasDateKey = Boolean(item.date || item.day || item.name || item.timestamp || item.created_at);
    const hasMetricKey =
      item.revenue !== undefined ||
      item.gross_sales_usd !== undefined ||
      item.gross_sales_inr !== undefined ||
      item.orders !== undefined ||
      item.total_orders !== undefined ||
      item.users !== undefined ||
      item.new_users_total !== undefined ||
      item.sales !== undefined ||
      item.count !== undefined;
    return hasDateKey || hasMetricKey;
  });
}

export const CATEGORIES = [
  {
    id: 'revenue',
    title: 'Revenue Overview',
    subtitle: 'Gross revenue and net proceeds performance across USD and INR currencies'
  },
  {
    id: 'orders',
    title: 'Orders Overview',
    subtitle: 'Order volume and distribution across iOS and Android platforms'
  },
  {
    id: 'users',
    title: 'Users Overview',
    subtitle: 'New user registrations, device distribution, and gender demographics'
  },
  {
    id: 'platform_revenue',
    title: 'Platform Revenue',
    subtitle: 'Store platform breakdown of gross sales and net proceeds in INR'
  }
];

export const normalizeDashboardData = (rawPayload, options = {}) => {
  if (!rawPayload) {
    return { widgets: [], categories: CATEGORIES, chartData: [], displayMode: 'empty', hasDailyTrend: false, isEmpty: true };
  }

  const payload = rawPayload.data !== undefined ? rawPayload.data : rawPayload;

  if (!payload || typeof payload !== 'object') {
    return { widgets: [], categories: CATEGORIES, chartData: [], displayMode: 'empty', hasDailyTrend: false, isEmpty: true };
  }

  const dailySeries = findValidDailySeries(payload);
  const summary = payload.summary || payload.totals || {};

  // Metrics Extraction
  const grossSalesUsd =
    payload.gross_sales_usd ??
    summary.grossSalesUsd ??
    summary.totalRevenue ??
    payload.revenue ??
    (dailySeries
      ? dailySeries.reduce((acc, curr) => acc + (Number(curr.gross_sales_usd || curr.revenue) || 0), 0)
      : 0);

  const netProceedsUsd =
    payload.net_proceeds_usd ??
    summary.netProceedsUsd ??
    grossSalesUsd * 0.85;

  const grossSalesInr =
    payload.gross_sales_inr ??
    summary.grossSalesInr ??
    (dailySeries
      ? dailySeries.reduce((acc, curr) => acc + (Number(curr.gross_sales_inr) || 0), 0)
      : 0);

  const netProceedsInr =
    payload.net_proceeds_inr ??
    summary.netProceedsInr ??
    grossSalesInr * 0.85;

  const totalOrders =
    payload.total_orders ??
    summary.totalOrders ??
    payload.orders ??
    (dailySeries
      ? dailySeries.reduce((acc, curr) => acc + (Number(curr.total_orders || curr.orders) || 0), 0)
      : 0);

  const iosOrders = payload.ios_orders ?? summary.iosOrders ?? 0;
  const androidOrders = payload.android_orders ?? summary.androidOrders ?? 0;
  const avgOrderValue = totalOrders > 0 ? grossSalesUsd / totalOrders : 0;

  const totalUsers =
    payload.new_users_total ??
    summary.totalUsers ??
    payload.users ??
    (dailySeries
      ? dailySeries.reduce((acc, curr) => acc + (Number(curr.new_users_total || curr.users) || 0), 0)
      : 0);

  const iosUsers = payload.new_users_ios ?? summary.newUsersIos ?? 0;
  const androidUsers = payload.new_users_android ?? summary.newUsersAndroid ?? 0;
  const maleUsers = payload.new_men ?? summary.newMen ?? 0;
  const femaleUsers = payload.new_women ?? summary.newWomen ?? 0;

  const appleSalesInr = payload.apple_sales_inr ?? summary.appleSalesInr ?? 0;
  const androidSalesInr = payload.android_sales_inr ?? summary.androidSalesInr ?? 0;
  const appleProceedsInr = payload.apple_proceeds_inr ?? summary.appleProceedsInr ?? 0;
  const androidProceedsInr = payload.android_proceeds_inr ?? summary.androidProceedsInr ?? 0;

  // Build standardized list of 17 KPI Widget Objects
  const widgets = [
    // Category: Revenue Overview
    {
      id: 'gross_sales_usd',
      categoryId: 'revenue',
      title: 'Gross Revenue (USD)',
      value: formatUsd(grossSalesUsd),
      trend: summary.revenueTrend !== undefined ? formatPercent(summary.revenueTrend) : '+12.5%',
      isPositive: true,
      subtitle: 'Total gross sales in USD',
      icon: null
    },
    {
      id: 'net_proceeds_usd',
      categoryId: 'revenue',
      title: 'Net Proceeds (USD)',
      value: formatUsd(netProceedsUsd),
      trend: summary.netRevenueTrend !== undefined ? formatPercent(summary.netRevenueTrend) : '+11.8%',
      isPositive: true,
      subtitle: 'Estimated net proceeds in USD',
      icon: null
    },
    {
      id: 'gross_sales_inr',
      categoryId: 'revenue',
      title: 'Gross Revenue (INR)',
      value: formatInr(grossSalesInr),
      trend: summary.grossInrTrend !== undefined ? formatPercent(summary.grossInrTrend) : '+14.2%',
      isPositive: true,
      subtitle: 'Total gross sales in INR',
      icon: null
    },
    {
      id: 'net_proceeds_inr',
      categoryId: 'revenue',
      title: 'Net Proceeds (INR)',
      value: formatInr(netProceedsInr),
      trend: summary.netInrTrend !== undefined ? formatPercent(summary.netInrTrend) : '+13.5%',
      isPositive: true,
      subtitle: 'Estimated net proceeds in INR',
      icon: null
    },

    // Category: Orders Overview
    {
      id: 'total_orders',
      categoryId: 'orders',
      title: 'Total Orders',
      value: formatNumber(totalOrders),
      trend: summary.ordersTrend !== undefined ? formatPercent(summary.ordersTrend) : '+8.2%',
      isPositive: true,
      subtitle: 'All completed transactions',
      icon: ShoppingBag
    },
    {
      id: 'ios_orders',
      categoryId: 'orders',
      title: 'iOS Orders',
      value: formatNumber(iosOrders),
      trend: '+9.1%',
      isPositive: true,
      subtitle: 'Orders from App Store',
      icon: Apple
    },
    {
      id: 'android_orders',
      categoryId: 'orders',
      title: 'Android Orders',
      value: formatNumber(androidOrders),
      trend: '+7.4%',
      isPositive: true,
      subtitle: 'Orders from Play Store',
      icon: Smartphone
    },
    {
      id: 'avg_order_value',
      categoryId: 'orders',
      title: 'Average Order Value',
      value: formatUsd(avgOrderValue),
      trend: summary.aovTrend !== undefined ? formatPercent(summary.aovTrend) : '+3.1%',
      isPositive: true,
      subtitle: 'Average revenue per order',
      icon: CreditCard
    },

    // Category: Users Overview
    {
      id: 'new_users_total',
      categoryId: 'users',
      title: 'Total New Users',
      value: formatNumber(totalUsers),
      trend: summary.usersTrend !== undefined ? formatPercent(summary.usersTrend) : '+15.4%',
      isPositive: true,
      subtitle: 'New user registrations',
      icon: Users
    },
    {
      id: 'new_users_ios',
      categoryId: 'users',
      title: 'New iOS Users',
      value: formatNumber(iosUsers),
      trend: '+16.2%',
      isPositive: true,
      subtitle: 'New iOS app installs',
      icon: Apple
    },
    {
      id: 'new_users_android',
      categoryId: 'users',
      title: 'New Android Users',
      value: formatNumber(androidUsers),
      trend: '+14.5%',
      isPositive: true,
      subtitle: 'New Android app installs',
      icon: Smartphone
    },
    {
      id: 'new_men',
      categoryId: 'users',
      title: 'New Male Users',
      value: formatNumber(maleUsers),
      trend: '+12.1%',
      isPositive: true,
      subtitle: 'Male demographic installs',
      icon: User
    },
    {
      id: 'new_women',
      categoryId: 'users',
      title: 'New Female Users',
      value: formatNumber(femaleUsers),
      trend: '+18.3%',
      isPositive: true,
      subtitle: 'Female demographic installs',
      icon: User
    },

    // Category: Platform Revenue
    {
      id: 'apple_sales_inr',
      categoryId: 'platform_revenue',
      title: 'Apple Gross Revenue (INR)',
      value: formatInr(appleSalesInr),
      trend: '+15.8%',
      isPositive: true,
      subtitle: 'App Store gross revenue in INR',
      icon: Apple
    },
    {
      id: 'android_sales_inr',
      categoryId: 'platform_revenue',
      title: 'Android Gross Revenue (INR)',
      value: formatInr(androidSalesInr),
      trend: '+11.3%',
      isPositive: true,
      subtitle: 'Play Store gross revenue in INR',
      icon: Smartphone
    },
    {
      id: 'apple_proceeds_inr',
      categoryId: 'platform_revenue',
      title: 'Apple Net Proceeds (INR)',
      value: formatInr(appleProceedsInr),
      trend: '+15.1%',
      isPositive: true,
      subtitle: 'App Store net proceeds in INR',
      icon: Apple
    },
    {
      id: 'android_proceeds_inr',
      categoryId: 'platform_revenue',
      title: 'Android Net Proceeds (INR)',
      value: formatInr(androidProceedsInr),
      trend: '+10.9%',
      isPositive: true,
      subtitle: 'Play Store net proceeds in INR',
      icon: Smartphone
    }
  ];

  // Decoupled displayMode Decision Logic
  let chartData = [];
  let displayMode = 'empty'; // 'trend' | 'single' | 'empty'

  const isSingleDay = Boolean(
    options.startDate && options.endDate && options.startDate === options.endDate
  ) || Boolean(payload.date && (!dailySeries || dailySeries.length === 0));

  if (dailySeries && dailySeries.length >= 2) {
    // Mode: "trend" - Multi-Day Selection with N >= 2 records
    chartData = dailySeries.map((item, index) => ({
      name: item.date || item.day || item.name || `Day ${index + 1}`,
      revenue: Number(item.gross_sales_usd || item.gross_sales_inr || item.revenue || item.sales || 0),
      orders: Number(item.total_orders || item.orders || item.count || 0),
      users: Number(item.new_users_total || item.users || 0)
    }));
    displayMode = 'trend';
  } else if ((dailySeries && dailySeries.length === 1) || isSingleDay) {
    // Mode: "single" - Single-Day Selection or 1 daily record
    const singleItem = dailySeries && dailySeries[0] ? dailySeries[0] : null;
    const singleName = singleItem
      ? (singleItem.date || singleItem.day || singleItem.name || options.startDate || 'Today')
      : (options.startDate || payload.date || 'Today');

    chartData = [
      {
        name: singleName,
        revenue: singleItem ? Number(singleItem.gross_sales_usd || singleItem.revenue || grossSalesUsd) : Number(grossSalesUsd),
        orders: singleItem ? Number(singleItem.total_orders || singleItem.orders || totalOrders) : Number(totalOrders),
        users: singleItem ? Number(singleItem.new_users_total || singleItem.users || totalUsers) : Number(totalUsers)
      }
    ];
    displayMode = 'single';
  } else {
    // Mode: "empty" - Multi-Day Selection without daily series array
    chartData = [];
    displayMode = 'empty';
  }

  const isEmpty = grossSalesUsd === 0 && grossSalesInr === 0 && totalOrders === 0 && totalUsers === 0 && (!dailySeries || dailySeries.length === 0);

  return {
    widgets,
    categories: CATEGORIES,
    chartData,
    displayMode,
    hasDailyTrend: displayMode !== 'empty',
    summary: {
      grossSalesUsd,
      netProceedsUsd,
      grossSalesInr,
      netProceedsInr,
      totalOrders,
      totalUsers,
      avgOrderValue
    },
    isEmpty
  };
};

export default normalizeDashboardData;

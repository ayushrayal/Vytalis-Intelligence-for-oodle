/**
 * Normalizes backend response from GET /api/v1/analytics/countries into UI-ready structured data.
 * ALL calculations, percentages, formatting, and top country aggregations are performed here.
 */

const formatInr = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `₹${Number(amount).toFixed(2)}`;
  }
};

const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
};

const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(1)}%`;
};

export const normalizeCountriesData = (rawPayload) => {
  if (!rawPayload) {
    return {
      summary: {
        totalCountries: 0,
        totalOrders: 0,
        formattedTotalOrders: '0',
        totalGrossSalesInr: 0,
        formattedTotalGrossSalesInr: '₹0.00',
        totalNetProceedsInr: 0,
        formattedTotalNetProceedsInr: '₹0.00',
        avgSalesPerOrderInr: 0,
        formattedAvgSalesPerOrderInr: '₹0.00',
        topCountryByRevenue: null,
        topCountryByOrders: null
      },
      countries: [],
      charts: {
        topByRevenue: [],
        topByOrders: []
      },
      isEmpty: true
    };
  }

  // Extract array safely from raw response
  const rawList = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload.data)
    ? rawPayload.data
    : Array.isArray(rawPayload.countries)
    ? rawPayload.countries
    : [];

  // Overall totals
  const totalCountries = rawList.length;
  const totalOrders = rawList.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);
  const totalGrossSalesInr = rawList.reduce((sum, item) => sum + (Number(item.gross_sales_inr) || 0), 0);
  const totalNetProceedsInr = rawList.reduce((sum, item) => sum + (Number(item.net_proceeds_inr) || 0), 0);
  const avgSalesPerOrderInr = totalOrders > 0 ? totalGrossSalesInr / totalOrders : 0;

  // Process item-level records with pre-computed & pre-formatted UI properties
  const normalizedCountries = rawList.map((item, idx) => {
    const countryName = item.country || `Country ${idx + 1}`;
    const orders = Number(item.orders ?? 0);
    const grossSalesInr = Number(item.gross_sales_inr ?? 0);
    const netProceedsInr = Number(item.net_proceeds_inr ?? 0);

    const avgSalesPerOrder = orders > 0 ? grossSalesInr / orders : 0;
    const revenueSharePercent = totalGrossSalesInr > 0 ? (grossSalesInr / totalGrossSalesInr) * 100 : 0;
    const ordersSharePercent = totalOrders > 0 ? (orders / totalOrders) * 100 : 0;

    return {
      id: countryName,
      country: countryName,
      orders,
      formattedOrders: formatNumber(orders),
      grossSalesInr,
      formattedGrossSalesInr: formatInr(grossSalesInr),
      netProceedsInr,
      formattedNetProceedsInr: formatInr(netProceedsInr),
      avgSalesPerOrder,
      formattedAvgSalesPerOrder: formatInr(avgSalesPerOrder),
      revenueSharePercent,
      formattedRevenueSharePercent: formatPercent(revenueSharePercent),
      ordersSharePercent,
      formattedOrdersSharePercent: formatPercent(ordersSharePercent),
      rawCountry: item
    };
  });

  // Identify Top Country by Revenue & Top Country by Volume
  const sortedByRevenue = [...normalizedCountries].sort((a, b) => b.grossSalesInr - a.grossSalesInr);
  const sortedByOrders = [...normalizedCountries].sort((a, b) => b.orders - a.orders);

  const topCountryByRevenue = sortedByRevenue.length > 0 ? sortedByRevenue[0] : null;
  const topCountryByOrders = sortedByOrders.length > 0 ? sortedByOrders[0] : null;

  // Chart data: Top 10 Countries by Revenue and by Orders for Recharts
  const topByRevenueChart = sortedByRevenue.slice(0, 10).map((item) => ({
    name: item.country,
    grossSales: item.grossSalesInr,
    formattedSales: item.formattedGrossSalesInr,
    netProceeds: item.netProceedsInr,
    formattedNet: item.formattedNetProceedsInr,
    orders: item.orders,
    sharePercent: item.revenueSharePercent
  }));

  const topByOrdersChart = sortedByOrders.slice(0, 10).map((item) => ({
    name: item.country,
    orders: item.orders,
    formattedOrders: item.formattedOrders,
    grossSales: item.grossSalesInr,
    formattedSales: item.formattedGrossSalesInr,
    sharePercent: item.ordersSharePercent
  }));

  return {
    summary: {
      totalCountries,
      totalOrders,
      formattedTotalOrders: formatNumber(totalOrders),
      totalGrossSalesInr,
      formattedTotalGrossSalesInr: formatInr(totalGrossSalesInr),
      totalNetProceedsInr,
      formattedTotalNetProceedsInr: formatInr(totalNetProceedsInr),
      avgSalesPerOrderInr,
      formattedAvgSalesPerOrderInr: formatInr(avgSalesPerOrderInr),
      topCountryByRevenue,
      topCountryByOrders
    },
    countries: normalizedCountries,
    charts: {
      topByRevenue: topByRevenueChart,
      topByOrders: topByOrdersChart
    },
    isEmpty: normalizedCountries.length === 0
  };
};

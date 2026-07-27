/**
 * Normalizes backend response from GET /api/v1/analytics/orders into structured UI data.
 * Safe against missing/null values, unknown response wrappers, and structural changes.
 */

const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `$${Number(amount).toFixed(2)}`;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return String(isoString);
  }
};

export const normalizeOrdersData = (rawPayload) => {
  if (!rawPayload) {
    return {
      orders: [],
      meta: { total: 0, page: 1, limit: 50, totalPages: 1 },
      summary: { totalOrders: 0, totalRevenueUsd: 0, totalNetUsd: 0 },
      isEmpty: true
    };
  }

  // Extract nested data payload if wrapped in { success: true, data: ... }
  const payload = rawPayload.data !== undefined ? rawPayload.data : rawPayload;

  // Locate the orders list safely
  const rawOrdersList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.orders)
    ? payload.orders
    : Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.data)
    ? payload.data
    : [];

  const total = Number(payload.total ?? payload.count ?? rawOrdersList.length);
  const page = Number(payload.page ?? payload.currentPage ?? 1);
  const limit = Number(payload.limit ?? payload.pageSize ?? 50);
  const totalPages = Math.max(1, Math.ceil(total / (limit || 50)));

  const normalizedOrders = rawOrdersList.map((order, idx) => {
    const orderId = order.order_id || order.id || `ORDER-${idx + 1}`;
    const platform = (order.platform || 'unknown').toLowerCase();
    const country = order.country || 'N/A';
    const product = order.product || 'N/A';
    const purchaseTimeRaw = order.purchase_time || order.created_at || order.date || null;
    const purchaseTimeFormatted = formatDate(purchaseTimeRaw);

    const currency = order.currency || 'USD';
    const originalAmount = Number(order.original_amount ?? 0);
    const usdAmount = Number(order.usd_amount ?? 0);
    const estimatedNetUsd = Number(order.estimated_net_usd ?? 0);
    const inrAmount = Number(order.inr_amount ?? 0);
    const estimatedNetInr = Number(order.estimated_net_inr ?? 0);
    const exchangeRate = Number(order.exchange_rate ?? 1);

    return {
      id: orderId,
      orderId,
      platform,
      country,
      product,
      purchaseTimeRaw,
      purchaseTimeFormatted,
      currency,
      originalAmount,
      formattedOriginalAmount: formatCurrency(originalAmount, currency),
      usdAmount,
      formattedUsdAmount: formatCurrency(usdAmount, 'USD'),
      estimatedNetUsd,
      formattedEstimatedNetUsd: formatCurrency(estimatedNetUsd, 'USD'),
      inrAmount,
      formattedInrAmount: formatCurrency(inrAmount, 'INR'),
      estimatedNetInr,
      formattedEstimatedNetInr: formatCurrency(estimatedNetInr, 'INR'),
      exchangeRate,
      rawOrder: order
    };
  });

  const totalRevenueUsd = normalizedOrders.reduce((sum, item) => sum + item.usdAmount, 0);
  const totalNetUsd = normalizedOrders.reduce((sum, item) => sum + item.estimatedNetUsd, 0);

  return {
    orders: normalizedOrders,
    meta: {
      total,
      page,
      limit,
      totalPages
    },
    summary: {
      totalOrders: total || normalizedOrders.length,
      totalRevenueUsd,
      formattedTotalRevenueUsd: formatCurrency(totalRevenueUsd, 'USD'),
      totalNetUsd,
      formattedTotalNetUsd: formatCurrency(totalNetUsd, 'USD')
    },
    isEmpty: normalizedOrders.length === 0
  };
};

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getOrders } from '../services/orders.service.js';
import { normalizeOrdersData } from '../utils/normalizeOrdersData.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useOrders() {
  const {
    selectedPreset,
    singleDate,
    fromDate,
    toDate,
    refreshVersion,
    markRefreshSuccess,
    markRefreshError
  } = useDateFilter();

  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRefreshVersion = useRef(refreshVersion);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    platform: 'all' // 'all', 'ios', 'android'
  });

  // Sorting State
  const [sortBy, setSortBy] = useState('purchaseTimeRaw');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrdersData = useCallback(async (isManualBypass = false) => {
    setLoading(true);
    setError(null);

    const params = buildAnalyticsParams({
      selectedPreset,
      singleDate,
      fromDate,
      toDate,
      isManualBypass
    });

    try {
      const response = await getOrders(params);
      const normalized = normalizeOrdersData(response);
      setRawData(normalized);
      markRefreshSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch orders analytics data';
      setError(message);
      markRefreshError();
    } finally {
      setLoading(false);
    }
  }, [selectedPreset, singleDate, fromDate, toDate, markRefreshSuccess, markRefreshError]);

  useEffect(() => {
    const isManualBypass = refreshVersion !== prevRefreshVersion.current;
    prevRefreshVersion.current = refreshVersion;
    fetchOrdersData(isManualBypass);
  }, [fetchOrdersData, refreshVersion]);

  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const processedOrders = useMemo(() => {
    if (!rawData || !rawData.orders) return [];
    let result = [...rawData.orders];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((item) => {
        return (
          item.orderId.toLowerCase().includes(query) ||
          item.country.toLowerCase().includes(query) ||
          item.platform.toLowerCase().includes(query) ||
          item.product.toLowerCase().includes(query)
        );
      });
    }

    if (filters.platform && filters.platform !== 'all') {
      const targetPlatform = filters.platform.toLowerCase();
      result = result.filter((item) => item.platform === targetPlatform);
    }

    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'purchaseTimeRaw') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawData, search, filters, sortBy, sortOrder]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedOrders.slice(start, start + pageSize);
  }, [processedOrders, page, pageSize]);

  const totalFilteredCount = processedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const pagination = {
    page,
    pageSize,
    total: totalFilteredCount,
    totalPages,
    setPage,
    setPageSize
  };

  const sorting = {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleSort
  };

  const data = useMemo(() => {
    if (!rawData) return null;
    return {
      orders: paginatedOrders,
      allFilteredOrders: processedOrders,
      summary: rawData.summary,
      meta: {
        total: totalFilteredCount,
        page,
        limit: pageSize,
        totalPages
      },
      isEmpty: processedOrders.length === 0
    };
  }, [rawData, paginatedOrders, processedOrders, totalFilteredCount, page, pageSize, totalPages]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchOrdersData(true),
    search,
    setSearch,
    filters,
    setFilters,
    pagination,
    sorting
  };
}

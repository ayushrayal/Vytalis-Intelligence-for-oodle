import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { getCountries } from '../services/countries.service.js';
import { normalizeCountriesData } from '../utils/normalizeCountriesData.js';
import { sortData } from '../../../utils/tableUtils.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { validateDateRange } from '../../../utils/validateDateRange.js';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useCountries() {
  const {
    startDate,
    endDate,
    refreshVersion,
    markRefreshSuccess,
    markRefreshError
  } = useDateFilter();

  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRefreshVersion = useRef(refreshVersion);
  const abortControllerRef = useRef(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    salesOnly: 'all' // 'all' | 'activeSales'
  });

  // Sorting State
  const [sortBy, setSortBy] = useState('grossSalesInr');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchCountriesData = useCallback(async (isManualBypass = false) => {
    // 1. Cancel previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 2. Validate dates before requesting
    const validation = validateDateRange({ startDate, endDate });
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      markRefreshError();
      return;
    }

    // 3. Build request query parameters
    const params = buildAnalyticsParams({ startDate, endDate }, { isManualBypass });

    // 4. Set loading state while keeping previous data visible
    setLoading(true);
    setError(null);

    try {
      const response = await getCountries(params, controller.signal);
      const normalized = normalizeCountriesData(response);
      setRawData(normalized);
      markRefreshSuccess();
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      const message =
        err.parsedMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch countries analytics data';
      setError(message);
      markRefreshError();
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [startDate, endDate, markRefreshSuccess, markRefreshError]);

  useEffect(() => {
    const isManualBypass = refreshVersion !== prevRefreshVersion.current;
    prevRefreshVersion.current = refreshVersion;
    fetchCountriesData(isManualBypass);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCountriesData, refreshVersion]);

  const processedCountries = useMemo(() => {
    if (!rawData || !rawData.countries) return [];

    let result = [...rawData.countries];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((item) => item.country.toLowerCase().includes(query));
    }

    if (filters.salesOnly === 'activeSales') {
      result = result.filter((item) => item.grossSalesInr > 0);
    }

    return sortData(result, sortBy, sortOrder);
  }, [rawData, search, filters, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
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
      summary: rawData.summary,
      countries: processedCountries,
      charts: rawData.charts,
      isEmpty: processedCountries.length === 0
    };
  }, [rawData, processedCountries]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchCountriesData(true),
    search,
    setSearch,
    filters,
    setFilters,
    sorting
  };
}

export default useCountries;

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getCountries } from '../services/countries.service.js';
import { normalizeCountriesData } from '../utils/normalizeCountriesData.js';
import { sortData } from '../../../utils/tableUtils.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useCountries() {
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
    salesOnly: 'all' // 'all' | 'activeSales'
  });

  // Sorting State
  const [sortBy, setSortBy] = useState('grossSalesInr');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchCountriesData = useCallback(async (isManualBypass = false) => {
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
      const response = await getCountries(params);
      const normalized = normalizeCountriesData(response);
      setRawData(normalized);
      markRefreshSuccess();
    } catch (err) {
      const message =
        err.parsedMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch countries analytics data';
      setError(message);
      markRefreshError();
    } finally {
      setLoading(false);
    }
  }, [selectedPreset, singleDate, fromDate, toDate, markRefreshSuccess, markRefreshError]);

  useEffect(() => {
    const isManualBypass = refreshVersion !== prevRefreshVersion.current;
    prevRefreshVersion.current = refreshVersion;
    fetchCountriesData(isManualBypass);
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

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getUsers } from '../services/users.service.js';
import { normalizeUsersData } from '../utils/normalizeUsersData.js';
import { sortData } from '../../../utils/tableUtils.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useUsers() {
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

  // Lightweight Filters State (Platform & Gender)
  const [filters, setFilters] = useState({
    platform: 'all',
    gender: 'all'
  });

  // Sorting State
  const [sortBy, setSortBy] = useState('count');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchUsersData = useCallback(async (isManualBypass = false) => {
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
      const response = await getUsers(params);
      const normalized = normalizeUsersData(response);
      setRawData(normalized);
      markRefreshSuccess();
    } catch (err) {
      const message =
        err.parsedMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch users analytics data';
      setError(message);
      markRefreshError();
    } finally {
      setLoading(false);
    }
  }, [selectedPreset, singleDate, fromDate, toDate, markRefreshSuccess, markRefreshError]);

  useEffect(() => {
    const isManualBypass = refreshVersion !== prevRefreshVersion.current;
    prevRefreshVersion.current = refreshVersion;
    fetchUsersData(isManualBypass);
  }, [fetchUsersData, refreshVersion]);

  const processedUsers = useMemo(() => {
    if (!rawData || !rawData.users) return [];

    let result = [...rawData.users];

    if (filters.platform !== 'all') {
      result = result.filter(
        (item) => item.platform.toLowerCase() === filters.platform.toLowerCase()
      );
    }

    if (filters.gender !== 'all') {
      result = result.filter(
        (item) => item.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    return sortData(result, sortBy, sortOrder);
  }, [rawData, filters, sortBy, sortOrder]);

  const handleSort = (field) => {
    const allowedSortFields = ['platform', 'gender', 'count'];
    if (!allowedSortFields.includes(field)) return;

    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder(field === 'count' ? 'desc' : 'asc');
    }
  };

  const data = useMemo(() => {
    if (!rawData) return null;

    return {
      summary: rawData.summary,
      users: processedUsers,
      charts: rawData.charts,
      isEmpty: processedUsers.length === 0
    };
  }, [rawData, processedUsers]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchUsersData(true),
    filters,
    setFilters,
    sorting: {
      sortBy,
      sortOrder,
      setSortBy,
      setSortOrder,
      handleSort
    }
  };
}

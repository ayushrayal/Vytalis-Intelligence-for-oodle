import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { getUsers } from '../services/users.service.js';
import { normalizeUsersData } from '../utils/normalizeUsersData.js';
import { sortData } from '../../../utils/tableUtils.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { validateDateRange } from '../../../utils/validateDateRange.js';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useUsers() {
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

  // Lightweight Filters State (Platform & Gender)
  const [filters, setFilters] = useState({
    platform: 'all',
    gender: 'all'
  });

  // Sorting State
  const [sortBy, setSortBy] = useState('count');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchUsersData = useCallback(async (isManualBypass = false) => {
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
      const response = await getUsers(params, controller.signal);
      const normalized = normalizeUsersData(response);
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
        'Failed to fetch users analytics data';
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
    fetchUsersData(isManualBypass);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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

export default useUsers;

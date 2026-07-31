import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { getDailyAnalytics, getMetaOverview } from '../services/dashboard.service.js';
import { normalizeDashboardData } from '../utils/normalizeDashboardData.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { validateDateRange } from '../../../utils/validateDateRange.js';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useDashboard() {
  const {
    startDate,
    endDate,
    refreshVersion,
    markRefreshSuccess,
    markRefreshError
  } = useDateFilter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRefreshVersion = useRef(refreshVersion);
  const abortControllerRef = useRef(null);

  const fetchDashboardData = useCallback(async (isManualBypass = false) => {
    // 1. Cancel previous pending request to prevent race conditions
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

    // 4. Set loading state while retaining existing data to avoid UI flickering
    setLoading(true);
    setError(null);

    try {
      const [dailyResponse, metaResponse] = await Promise.all([
        getDailyAnalytics(params, controller.signal),
        getMetaOverview(params, controller.signal)
      ]);
      const normalized = normalizeDashboardData(dailyResponse, { startDate, endDate }, metaResponse);
      setData(normalized);
      markRefreshSuccess();
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        // Request was aborted due to rapid filter change; ignore silently
        return;
      }
      const message = err.parsedMessage || err.response?.data?.message || err.message || 'Failed to load dashboard analytics';
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
    fetchDashboardData(isManualBypass);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboardData, refreshVersion]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchDashboardData(true)
  };
}

export default useDashboard;

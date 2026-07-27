import { useState, useEffect, useCallback, useRef } from 'react';
import { getDailyAnalytics } from '../services/dashboard.service.js';
import { normalizeDashboardData } from '../utils/normalizeDashboardData.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import { buildAnalyticsParams } from '../../../utils/buildAnalyticsParams.js';

export function useDashboard() {
  const {
    selectedPreset,
    singleDate,
    fromDate,
    toDate,
    refreshVersion,
    markRefreshSuccess,
    markRefreshError
  } = useDateFilter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevRefreshVersion = useRef(refreshVersion);

  const fetchDashboardData = useCallback(async (isManualBypass = false) => {
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
      const response = await getDailyAnalytics(params);
      const normalized = normalizeDashboardData(response);
      setData(normalized);
      markRefreshSuccess();
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load dashboard analytics';
      setError(message);
      markRefreshError();
    } finally {
      setLoading(false);
    }
  }, [selectedPreset, singleDate, fromDate, toDate, markRefreshSuccess, markRefreshError]);

  useEffect(() => {
    const isManualBypass = refreshVersion !== prevRefreshVersion.current;
    prevRefreshVersion.current = refreshVersion;
    fetchDashboardData(isManualBypass);
  }, [fetchDashboardData, refreshVersion]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchDashboardData(true)
  };
}

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DATE_PRESETS, calculatePresetDates } from '../constants/datePresets.js';

const DateFilterContext = createContext(null);

const getTodayString = () => new Date().toISOString().split('T')[0];

export function DateFilterProvider({ children }) {
  const [selectedPreset, setSelectedPreset] = useState(() => {
    return localStorage.getItem('vytalis_date_preset') || localStorage.getItem('oodle_date_preset') || DATE_PRESETS.LAST_7_DAYS;
  });

  const [singleDate, setSingleDateState] = useState(() => {
    return localStorage.getItem('vytalis_single_date') || getTodayString();
  });

  const initialDates = useMemo(() => {
    const preset = localStorage.getItem('vytalis_date_preset') || localStorage.getItem('oodle_date_preset') || DATE_PRESETS.LAST_7_DAYS;
    if (preset === DATE_PRESETS.SINGLE_DATE) {
      const sDate = localStorage.getItem('vytalis_single_date') || getTodayString();
      return { from: sDate, to: sDate };
    }
    return calculatePresetDates(preset) || { from: '', to: '' };
  }, []);

  const [fromDate, setFromDate] = useState(initialDates.from);
  const [toDate, setToDate] = useState(initialDates.to);

  // Last successful refresh timestamp
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  // Global refresh state (loading lifecycle)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const setPreset = useCallback((presetKey) => {
    setSelectedPreset(presetKey);
    localStorage.setItem('vytalis_date_preset', presetKey);
    localStorage.setItem('oodle_date_preset', presetKey);

    if (presetKey !== DATE_PRESETS.CUSTOM && presetKey !== DATE_PRESETS.SINGLE_DATE) {
      const dates = calculatePresetDates(presetKey);
      if (dates) {
        setFromDate(dates.from);
        setToDate(dates.to);
      }
    }
  }, []);

  const setSingleDate = useCallback((dateStr) => {
    setSelectedPreset(DATE_PRESETS.SINGLE_DATE);
    setSingleDateState(dateStr);
    setFromDate(dateStr);
    setToDate(dateStr);
    localStorage.setItem('vytalis_date_preset', DATE_PRESETS.SINGLE_DATE);
    localStorage.setItem('vytalis_single_date', dateStr);
  }, []);

  const setCustomRange = useCallback(({ from, to }) => {
    setSelectedPreset(DATE_PRESETS.CUSTOM);
    setFromDate(from);
    setToDate(to);
    localStorage.setItem('vytalis_date_preset', DATE_PRESETS.CUSTOM);
  }, []);

  const refresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshVersion((v) => v + 1);
  }, [isRefreshing]);

  const markRefreshSuccess = useCallback(() => {
    setIsRefreshing(false);
    setLastUpdated(new Date());
  }, []);

  const markRefreshError = useCallback(() => {
    setIsRefreshing(false);
  }, []);

  const value = useMemo(() => ({
    selectedPreset,
    singleDate,
    fromDate,
    toDate,
    lastUpdated,
    isRefreshing,
    refreshVersion,
    setPreset,
    setSingleDate,
    setCustomRange,
    refresh,
    markRefreshSuccess,
    markRefreshError
  }), [
    selectedPreset,
    singleDate,
    fromDate,
    toDate,
    lastUpdated,
    isRefreshing,
    refreshVersion,
    setPreset,
    setSingleDate,
    setCustomRange,
    refresh,
    markRefreshSuccess,
    markRefreshError
  ]);

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
}

export function useDateFilter() {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
}

export default DateFilterContext;

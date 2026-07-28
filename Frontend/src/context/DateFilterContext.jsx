import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DATE_PRESETS } from '../constants/datePresets.js';
import { calculateFilterDates } from '../utils/calculateFilterDates.js';
import { toLocalYYYYMMDD } from '../utils/formatDate.js';

const DateFilterContext = createContext(null);

const getTodayString = () => toLocalYYYYMMDD(new Date());

export function DateFilterProvider({ children }) {
  // 1. Raw user selections stored in state
  const [preset, setPresetState] = useState(() => {
    return localStorage.getItem('vytalis_date_preset') || localStorage.getItem('oodle_date_preset') || DATE_PRESETS.LAST_7_DAYS;
  });

  const [singleDate, setSingleDateState] = useState(() => {
    return localStorage.getItem('vytalis_single_date') || getTodayString();
  });

  const [customRange, setCustomRangeState] = useState(() => {
    const savedStart = localStorage.getItem('vytalis_custom_start') || '';
    const savedEnd = localStorage.getItem('vytalis_custom_end') || '';
    return { startDate: savedStart, endDate: savedEnd };
  });

  // Global refresh lifecycle state
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  // 2. Derive { startDate, endDate } dynamically via calculateFilterDates
  const filterDates = useMemo(() => {
    return calculateFilterDates(preset, {
      singleDate,
      customRange
    });
  }, [preset, singleDate, customRange]);

  // 3. User action handlers
  const setPreset = useCallback((presetKey) => {
    setPresetState(presetKey);
    localStorage.setItem('vytalis_date_preset', presetKey);
    localStorage.setItem('oodle_date_preset', presetKey);
  }, []);

  const setSingleDate = useCallback((dateStr) => {
    setPresetState(DATE_PRESETS.SINGLE_DATE);
    setSingleDateState(dateStr);
    localStorage.setItem('vytalis_date_preset', DATE_PRESETS.SINGLE_DATE);
    localStorage.setItem('vytalis_single_date', dateStr);
  }, []);

  const setCustomRange = useCallback((rangeObj) => {
    const sDate = rangeObj?.startDate || rangeObj?.from || '';
    const eDate = rangeObj?.endDate || rangeObj?.to || '';
    setPresetState(DATE_PRESETS.CUSTOM);
    setCustomRangeState({ startDate: sDate, endDate: eDate });
    localStorage.setItem('vytalis_date_preset', DATE_PRESETS.CUSTOM);
    localStorage.setItem('vytalis_custom_start', sDate);
    localStorage.setItem('vytalis_custom_end', eDate);
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

  // 4. Exposed context value (with legacy aliases)
  const value = useMemo(() => ({
    preset,
    singleDate,
    customRange,
    startDate: filterDates.startDate,
    endDate: filterDates.endDate,

    // Backward compatibility aliases
    selectedPreset: preset,
    fromDate: filterDates.startDate,
    toDate: filterDates.endDate,
    date: filterDates.startDate === filterDates.endDate ? filterDates.startDate : null,

    // Lifecycle & actions
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
    preset,
    singleDate,
    customRange,
    filterDates,
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

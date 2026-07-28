import { calculateFilterDates } from '../utils/calculateFilterDates.js';

export const DATE_PRESETS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  CUSTOM: 'custom',
  SINGLE_DATE: 'single_date'
};

export const DATE_PRESET_LABELS = {
  [DATE_PRESETS.TODAY]: 'Today',
  [DATE_PRESETS.YESTERDAY]: 'Yesterday',
  [DATE_PRESETS.LAST_7_DAYS]: 'Last 7 Days',
  [DATE_PRESETS.LAST_30_DAYS]: 'Last 30 Days',
  [DATE_PRESETS.THIS_MONTH]: 'This Month',
  [DATE_PRESETS.LAST_MONTH]: 'Last Month',
  [DATE_PRESETS.CUSTOM]: 'Custom Range',
  [DATE_PRESETS.SINGLE_DATE]: 'Single Date'
};

/**
 * Legacy wrapper for calculateFilterDates for backward compatibility.
 */
export const calculatePresetDates = (presetKey, options) => {
  const result = calculateFilterDates(presetKey, options);
  if (result.startDate && result.endDate) {
    return { from: result.startDate, to: result.endDate };
  }
  return null;
};

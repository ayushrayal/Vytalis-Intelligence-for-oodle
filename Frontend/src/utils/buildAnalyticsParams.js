import { DATE_PRESETS } from '../constants/datePresets.js';

/**
 * Shared helper to build standardized query parameters for analytics endpoints.
 * When selectedPreset === DATE_PRESETS.SINGLE_DATE: returns ONLY { date: YYYY-MM-DD }.
 * For other presets: returns { preset, from, to }.
 */
export function buildAnalyticsParams({
  selectedPreset,
  singleDate,
  fromDate,
  toDate,
  isManualBypass = false
}) {
  const params = {};

  if (selectedPreset === DATE_PRESETS.SINGLE_DATE) {
    const targetDate = singleDate || fromDate;
    if (targetDate) {
      params.date = targetDate;
    }
  } else {
    if (selectedPreset) params.preset = selectedPreset;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
  }

  if (isManualBypass) {
    params.bypassCache = 'true';
  }

  return params;
}

export default buildAnalyticsParams;

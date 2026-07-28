import { calculateFilterDates } from './calculateFilterDates.js';

/**
 * Shared request builder that converts calculated filter dates into backend request query parameters.
 *
 * Unified Strategy:
 * - Always generates { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', [bypassCache: 'true'] }
 * - Never includes the `date` parameter.
 */
export function buildAnalyticsParams(filterInput = {}, optionsInput = {}) {
  const params = {};

  let startDate = filterInput.startDate;
  let endDate = filterInput.endDate;
  const isBypass = Boolean(
    optionsInput.bypassCache ||
    optionsInput.isManualBypass ||
    filterInput.bypassCache ||
    filterInput.isManualBypass
  );

  // Handle legacy/preset arguments if startDate/endDate are not directly provided
  if (!startDate || !endDate) {
    const presetKey = filterInput.selectedPreset || filterInput.preset;
    if (presetKey) {
      const computed = calculateFilterDates(presetKey, {
        singleDate: filterInput.singleDate,
        customRange: {
          startDate: filterInput.fromDate || filterInput.startDate,
          endDate: filterInput.toDate || filterInput.endDate
        }
      });
      startDate = computed.startDate;
      endDate = computed.endDate;
    }
  }

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  // Optional manual cache bypass
  if (isBypass) {
    params.bypassCache = 'true';
  }

  return params;
}

export default buildAnalyticsParams;

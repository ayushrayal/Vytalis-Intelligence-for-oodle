/**
 * Reusable Date Preset Constants
 * Used across DateFilterContext, Hooks, Components, and Services.
 */
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
 * Calculates start and end date formatted as YYYY-MM-DD for a given preset.
 */
export const calculatePresetDates = (presetKey) => {
  const today = new Date();
  const formatDate = (d) => d.toISOString().split('T')[0];

  let from = new Date();
  let to = new Date();

  switch (presetKey) {
    case DATE_PRESETS.TODAY:
      from = today;
      to = today;
      break;

    case DATE_PRESETS.YESTERDAY:
      from = new Date(today);
      from.setDate(today.getDate() - 1);
      to = new Date(from);
      break;

    case DATE_PRESETS.LAST_7_DAYS:
      from = new Date(today);
      from.setDate(today.getDate() - 6);
      to = today;
      break;

    case DATE_PRESETS.LAST_30_DAYS:
      from = new Date(today);
      from.setDate(today.getDate() - 29);
      to = today;
      break;

    case DATE_PRESETS.THIS_MONTH:
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = today;
      break;

    case DATE_PRESETS.LAST_MONTH:
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    case DATE_PRESETS.SINGLE_DATE:
    case DATE_PRESETS.CUSTOM:
    default:
      return null;
  }

  return {
    from: formatDate(from),
    to: formatDate(to)
  };
};

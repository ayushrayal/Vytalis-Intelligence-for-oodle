/**
 * Validates calculated date parameters before dispatching API requests.
 *
 * @param {Object} filterDates - Object containing { startDate, endDate }
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validateDateRange({ startDate, endDate } = {}) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate || !endDate) {
    return { isValid: false, error: 'Both start date and end date are required for analytics query.' };
  }

  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return { isValid: false, error: 'Invalid date format. Expected YYYY-MM-DD.' };
  }

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date values selected.' };
  }

  if (start.getTime() > end.getTime()) {
    return { isValid: false, error: 'Start date cannot be after end date.' };
  }

  return { isValid: true, error: null };
}

export default validateDateRange;

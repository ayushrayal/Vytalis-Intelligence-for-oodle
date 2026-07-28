/**
 * Helper to format a JS Date object into YYYY-MM-DD string using local timezone.
 * Avoids UTC ISO string shifts.
 */
export function toLocalYYYYMMDD(d) {
  if (!d || isNaN(new Date(d).getTime())) return '';
  const dateObj = new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date string for UI display (e.g. "Jul 28, 2026").
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default {
  toLocalYYYYMMDD,
  formatDisplayDate
};

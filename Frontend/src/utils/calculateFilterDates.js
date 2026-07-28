import { DATE_PRESETS } from '../constants/datePresets.js';
import { toLocalYYYYMMDD } from './formatDate.js';

/**
 * Pure utility function to calculate target date parameters based on selected preset.
 * Always returns { startDate, endDate } formatted in local YYYY-MM-DD format.
 *
 * Unified Strategy:
 * - ALL presets (including TODAY, YESTERDAY, SINGLE_DATE) return { startDate: YYYY-MM-DD, endDate: YYYY-MM-DD }.
 * - For single-day presets, startDate === endDate.
 */
export function calculateFilterDates(preset, options = {}) {
  const { singleDate, customRange } = options;
  const today = new Date();
  const todayStr = toLocalYYYYMMDD(today);

  switch (preset) {
    case DATE_PRESETS.TODAY: {
      return {
        startDate: todayStr,
        endDate: todayStr
      };
    }

    case DATE_PRESETS.YESTERDAY: {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = toLocalYYYYMMDD(yesterday);
      return {
        startDate: yesterdayStr,
        endDate: yesterdayStr
      };
    }

    case DATE_PRESETS.SINGLE_DATE: {
      const targetDate = singleDate ? toLocalYYYYMMDD(new Date(singleDate)) : todayStr;
      const finalDate = targetDate || todayStr;
      return {
        startDate: finalDate,
        endDate: finalDate
      };
    }

    case DATE_PRESETS.LAST_7_DAYS: {
      const from = new Date(today);
      from.setDate(today.getDate() - 6);
      return {
        startDate: toLocalYYYYMMDD(from),
        endDate: todayStr
      };
    }

    case DATE_PRESETS.LAST_30_DAYS: {
      const from = new Date(today);
      from.setDate(today.getDate() - 29);
      return {
        startDate: toLocalYYYYMMDD(from),
        endDate: todayStr
      };
    }

    case DATE_PRESETS.THIS_MONTH: {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        startDate: toLocalYYYYMMDD(firstDay),
        endDate: todayStr
      };
    }

    case DATE_PRESETS.LAST_MONTH: {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        startDate: toLocalYYYYMMDD(firstDayLastMonth),
        endDate: toLocalYYYYMMDD(lastDayLastMonth)
      };
    }

    case DATE_PRESETS.CUSTOM: {
      const sDate = customRange?.startDate || customRange?.from || '';
      const eDate = customRange?.endDate || customRange?.to || '';
      return {
        startDate: sDate,
        endDate: eDate
      };
    }

    default: {
      // Fallback to Last 7 Days if preset is unknown
      const from = new Date(today);
      from.setDate(today.getDate() - 6);
      return {
        startDate: toLocalYYYYMMDD(from),
        endDate: todayStr
      };
    }
  }
}

export default calculateFilterDates;

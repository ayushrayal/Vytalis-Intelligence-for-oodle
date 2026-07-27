import * as analyticsService from '../services/analytics.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

const handleServiceError = (res, error, defaultMsg = 'Failed to fetch analytics data') => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return sendError(res, 'Analytics service request timed out', 504);
  }
  if (error.response) {
    const status = error.response.status || 500;
    const message = error.response.data?.message || error.response.data?.error || defaultMsg;
    return sendError(res, message, status);
  }
  return sendError(res, error.message || defaultMsg, 500);
};

export const getDailyAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getDailyAnalytics(req.query);
    return sendSuccess(res, data, 'Daily analytics retrieved successfully', 200);
  } catch (error) {
    return handleServiceError(res, error, 'Failed to fetch daily analytics');
  }
};

export const getOrdersAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getOrders(req.query);
    return sendSuccess(res, data, 'Orders analytics retrieved successfully', 200);
  } catch (error) {
    return handleServiceError(res, error, 'Failed to fetch orders analytics');
  }
};

export const getCountriesAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCountries(req.query);
    return sendSuccess(res, data, 'Countries analytics retrieved successfully', 200);
  } catch (error) {
    return handleServiceError(res, error, 'Failed to fetch countries analytics');
  }
};

export const getUsersAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getUsers(req.query);
    return sendSuccess(res, data, 'Users analytics retrieved successfully', 200);
  } catch (error) {
    return handleServiceError(res, error, 'Failed to fetch users analytics');
  }
};

// Aliases for compatibility
export const getOverview = getDailyAnalytics;

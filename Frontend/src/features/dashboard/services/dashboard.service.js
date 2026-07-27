import { axiosClient } from '../../../lib/axiosClient.js';

export const getDailyAnalytics = async (params) => {
  const response = await axiosClient.get('/analytics/daily', { params });
  return response.data;
};

export const getOverviewMetrics = async (params) => {
  const response = await axiosClient.get('/analytics/overview', { params });
  return response.data;
};

import { axiosClient } from '../../../lib/axiosClient.js';

export const getDailyAnalytics = async (params, signal) => {
  const response = await axiosClient.get('/analytics/daily', { params, signal });
  return response.data;
};

export const getOverviewMetrics = async (params, signal) => {
  const response = await axiosClient.get('/analytics/overview', { params, signal });
  return response.data;
};

export const getMetaOverview = async (params, signal) => {
  const response = await axiosClient.get('/analytics/meta/overview', {
    params,
    signal,
  });

  return response.data;
};
import { axiosClient } from '../../../lib/axiosClient.js';

export const getOrders = async (params, signal) => {
  const response = await axiosClient.get('/analytics/orders', { params, signal });
  return response.data;
};

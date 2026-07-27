import { axiosClient } from '../../../lib/axiosClient.js';

export const getOrders = async (params) => {
  const response = await axiosClient.get('/analytics/orders', { params });
  return response.data;
};

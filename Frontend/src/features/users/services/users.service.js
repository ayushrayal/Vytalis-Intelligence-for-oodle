import { axiosClient } from '../../../lib/axiosClient.js';

export const getUsers = async (params, signal) => {
  const response = await axiosClient.get('/analytics/users', { params, signal });
  return response.data;
};

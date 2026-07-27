import { axiosClient } from '../../../lib/axiosClient.js';

export const getUsers = async (params) => {
  const response = await axiosClient.get('/analytics/users', { params });
  return response.data;
};

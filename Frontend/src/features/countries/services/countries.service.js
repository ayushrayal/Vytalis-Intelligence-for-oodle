import { axiosClient } from '../../../lib/axiosClient.js';

export const getCountries = async (params) => {
  const response = await axiosClient.get('/analytics/countries', { params });
  return response.data;
};

export const getCountriesData = getCountries;

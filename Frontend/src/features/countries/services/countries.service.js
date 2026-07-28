import { axiosClient } from '../../../lib/axiosClient.js';

export const getCountries = async (params, signal) => {
  const response = await axiosClient.get('/analytics/countries', { params, signal });
  return response.data;
};

export const getCountriesData = getCountries;

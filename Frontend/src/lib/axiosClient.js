import axios from 'axios';
import { env } from '../config/env.js';
import { getToken } from '../features/auth/utils/authTokens.js';

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Inject Bearer token if available
axiosClient.interceptors.request.use((config) => {
  const token = getToken();



  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  

  return config;
});

// Response interceptor: Standardize error messages
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'Network error. Please check your connection.';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      customMessage = 'Request timed out. Please try again.';
    } else if (error.response) {
      customMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server returned error ${error.response.status}`;
    }

    error.parsedMessage = customMessage;
    return Promise.reject(error);
  }
);

export default axiosClient;

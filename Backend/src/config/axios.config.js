import axios from 'axios';
import { envConfig } from './env.config.js';

export const oodleClient = axios.create({
  baseURL: envConfig.oodleBaseUrl,
  headers: {
    'x-api-key': envConfig.oodleApiKey,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Transient error retry interceptor (Exponential backoff, max 2 retries)
oodleClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    // Initialize retry counter
    config.__retryCount = config.__retryCount || 0;
    const MAX_RETRIES = 2;

    // Check if error is transient
    const isNetworkError = !error.response && (error.code === 'ECONNABORTED' || error.message?.includes('Network Error') || error.message?.includes('timeout'));
    const isTransientStatus = error.response && [502, 503, 504].includes(error.response.status);

    const isTransient = isNetworkError || isTransientStatus;

    if (isTransient && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const backoffDelay = 200 * Math.pow(2, config.__retryCount - 1);

      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[AXIOS RETRY] Retrying upstream request (${config.__retryCount}/${MAX_RETRIES}) to ${config.url} after ${backoffDelay}ms due to: ${error.message}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return oodleClient(config);
    }

    return Promise.reject(error);
  }
);

export default oodleClient;

import { oodleClient } from '../config/axios.config.js';
import { cacheService } from './cache.service.js';
import { dedupService } from './dedup.service.js';
import { CACHE_TTL } from '../config/cache.config.js';
import { generateCacheKey } from '../utils/cacheKey.js';

export const getDailyAnalytics = async (params = {}) => {
  const cacheKey = generateCacheKey('daily', params);
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const data = await dedupService.dedupe(cacheKey, async () => {
    const response = await oodleClient.get('/analytics/daily', { params });
    return response.data;
  });

  await cacheService.set(cacheKey, data, CACHE_TTL.DAILY);
  return data;
};

export const getOrders = async (params = {}) => {
  const cacheKey = generateCacheKey('orders', params);
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const data = await dedupService.dedupe(cacheKey, async () => {
    const response = await oodleClient.get('/analytics/orders', { params });
    return response.data;
  });

  await cacheService.set(cacheKey, data, CACHE_TTL.ORDERS);
  return data;
};

export const getCountries = async (params = {}) => {
  const cacheKey = generateCacheKey('countries', params);
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const data = await dedupService.dedupe(cacheKey, async () => {
    const response = await oodleClient.get('/analytics/countries', { params });
    return response.data;
  });

  await cacheService.set(cacheKey, data, CACHE_TTL.COUNTRIES);
  return data;
};

export const getUsers = async (params = {}) => {
  const cacheKey = generateCacheKey('users', params);
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const data = await dedupService.dedupe(cacheKey, async () => {
    const response = await oodleClient.get('/analytics/users', { params });
    return response.data;
  });

  await cacheService.set(cacheKey, data, CACHE_TTL.USERS);
  return data;
};

// Aliases for backwards compatibility with existing codebase
export const fetchOverviewMetrics = getDailyAnalytics;
export const fetchOrdersMetrics = getOrders;
export const fetchCountriesMetrics = getCountries;
export const fetchUsersMetrics = getUsers;

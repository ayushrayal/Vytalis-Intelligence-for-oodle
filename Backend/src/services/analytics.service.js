import { oodleClient } from '../config/axios.config.js';
import { cacheService } from './cache.service.js';
import { dedupService } from './dedup.service.js';
import { CACHE_TTL } from '../config/cache.config.js';
import { generateCacheKey } from '../utils/cacheKey.js';
import { windsorClient } from "../config/axios.config.js";
import { envConfig } from "../config/env.config.js";


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

export const getMetaOverview = async (params = {}) => {
  const date_from = params.date_from ?? params.startDate;
  const date_to = params.date_to ?? params.endDate;

  const requestParams = {
    api_key: envConfig.windsorApiKey,
    fields:
      "action_values_omni_purchase,spend,cost_per_action_type_mobile_app_install,purchase_roas_omni_purchase",
    date_from,
    date_to,
    filter: JSON.stringify([
      ["account_id", "eq", envConfig.windsorMetaAccountId],
    ]),
  };

  const windsorUrl = windsorClient.defaults.baseURL;


  try {
    const response = await windsorClient.get("", { params: requestParams });
    console.log('[Meta Overview] Windsor response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Meta Overview] Error stack trace:', error.stack || error);
    if (error.response) {
      console.error('[Meta Overview] Windsor error response:', error.response.data);
    }
    throw error;
  }
};
// Aliases for backwards compatibility with existing codebase
export const fetchOverviewMetrics = getDailyAnalytics;
export const fetchOrdersMetrics = getOrders;
export const fetchCountriesMetrics = getCountries;
export const fetchUsersMetrics = getUsers;

/**
 * Centralized cache TTL configuration (in seconds).
 */

export const CACHE_TTL = {
  DAILY: 60,      // 60 seconds
  ORDERS: 30,     // 30 seconds
  COUNTRIES: 300, // 300 seconds (5 minutes)
  USERS: 60       // 60 seconds
};

export default CACHE_TTL;

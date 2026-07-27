/**
 * Deterministic cache key generator.
 * Sorts query parameters alphabetically so param order does not alter the key.
 *
 * @param {string} prefix - Endpoint prefix e.g. 'daily', 'orders', 'countries', 'users'
 * @param {Object} params - Query parameters object
 * @returns {string} Deterministic cache key string
 */
export const generateCacheKey = (prefix, params = {}) => {
  if (!params || Object.keys(params).length === 0) {
    return prefix;
  }

  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys
    .map((key) => {
      const val = params[key];
      if (val === undefined || val === null) return '';
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    })
    .filter(Boolean)
    .join('&');

  return queryString ? `${prefix}?${queryString}` : prefix;
};

export default generateCacheKey;

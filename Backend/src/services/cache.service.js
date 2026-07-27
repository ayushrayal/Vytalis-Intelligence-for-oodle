/**
 * Centralized, pluggable cache service with in-memory TTL store.
 * Designed with an async interface so Redis or another store can replace it
 * without changing callers or controllers.
 */

class CacheService {
  constructor() {
    this.store = new Map();
  }

  isDevMode() {
    return process.env.NODE_ENV !== 'production';
  }

  /**
   * Retrieve item from cache.
   * Auto-removes expired entries.
   */
  async get(key) {
    if (!this.store.has(key)) {
      if (this.isDevMode()) console.log(`[CACHE MISS] Key: ${key}`);
      return null;
    }

    const entry = this.store.get(key);
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      if (this.isDevMode()) console.log(`[CACHE EXPIRED] Key: ${key}`);
      return null;
    }

    if (this.isDevMode()) console.log(`[CACHE HIT] Key: ${key}`);
    return entry.value;
  }

  /**
   * Store item in cache with TTL in seconds.
   * Only valid, successful values should be stored.
   */
  async set(key, value, ttlInSeconds) {
    if (value === undefined || value === null) return;

    const expiresAt = Date.now() + ttlInSeconds * 1000;
    this.store.set(key, { value, expiresAt });
    if (this.isDevMode()) console.log(`[CACHE SET] Key: ${key} (TTL: ${ttlInSeconds}s)`);
  }

  /**
   * Check if key exists and is unexpired.
   */
  async has(key) {
    const val = await this.get(key);
    return val !== null;
  }

  /**
   * Remove a specific key from cache.
   */
  async invalidate(key) {
    const existed = this.store.delete(key);
    if (existed && this.isDevMode()) {
      console.log(`[CACHE INVALIDATE] Key: ${key}`);
    }
  }

  /**
   * Clear all stored cache entries.
   */
  async clear() {
    this.store.clear();
    if (this.isDevMode()) console.log('[CACHE CLEAR] All entries cleared');
  }
}

export const cacheService = new CacheService();
export default cacheService;

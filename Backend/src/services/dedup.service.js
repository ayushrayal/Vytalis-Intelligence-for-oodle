/**
 * Request deduplication service.
 * Collapses concurrent identical requests into a single in-flight promise.
 * Guarantees promise cleanup via a finally block so failed requests never remain in memory.
 */

class DedupService {
  constructor() {
    this.inflight = new Map();
  }

  isDevMode() {
    return process.env.NODE_ENV !== 'production';
  }

  /**
   * Deduplicate async request execution by cache key.
   *
   * @param {string} key - Unique request key
   * @param {Function} fetchFn - Async function returning a promise
   * @returns {Promise<any>} Response promise
   */
  async dedupe(key, fetchFn) {
    if (this.inflight.has(key)) {
      if (this.isDevMode()) console.log(`[DEDUP HIT] Joining inflight request for key: ${key}`);
      return this.inflight.get(key);
    }

    const promise = (async () => {
      try {
        return await fetchFn();
      } finally {
        // Guaranteed cleanup of in-flight promise after resolution or failure
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    return promise;
  }

  /**
   * Check if request key is currently in-flight.
   */
  isInflight(key) {
    return this.inflight.has(key);
  }

  /**
   * Clear all inflight promises.
   */
  clear() {
    this.inflight.clear();
  }
}

export const dedupService = new DedupService();
export default dedupService;

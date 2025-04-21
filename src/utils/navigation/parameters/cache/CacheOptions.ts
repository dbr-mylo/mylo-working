
/**
 * Cache configuration options
 */
export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // time to live in milliseconds
}

/**
 * Default cache configuration
 */
export const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxSize: 100,
  ttl: 5 * 60 * 1000 // 5 minutes
};

/**
 * Cache metrics for monitoring
 */
export interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
  createdAt: number;
  lastCleanup?: number;
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  lastAccessed: number;
}

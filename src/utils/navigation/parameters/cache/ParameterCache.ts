
import { CacheOptions, DEFAULT_CACHE_OPTIONS, CacheMetrics, CacheEntry } from './CacheOptions';

/**
 * Generic cache implementation for parameters
 */
export class ParameterCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private options: CacheOptions;
  private metrics: CacheMetrics;

  constructor(options?: CacheOptions) {
    this.cache = new Map();
    this.options = { ...DEFAULT_CACHE_OPTIONS, ...options };
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      createdAt: Date.now()
    };
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      return undefined;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (this.options.ttl && now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      this.metrics.size = this.cache.size;
      this.metrics.misses++;
      return undefined;
    }
    
    // Update last accessed time
    entry.lastAccessed = now;
    this.metrics.hits++;
    return entry.value;
  }

  set(key: string, value: T): void {
    // Perform cleanup if needed before adding new entry
    if (this.options.maxSize && this.cache.size >= this.options.maxSize) {
      this.evictLRU();
      this.metrics.lastCleanup = Date.now();
    }

    const now = Date.now();
    this.cache.set(key, {
      value,
      timestamp: now,
      lastAccessed: now
    });
    
    this.metrics.size = this.cache.size;
  }

  // Evict least recently used entry
  private evictLRU(): void {
    if (this.cache.size === 0) return;
    
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
    this.metrics.size = 0;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }
}

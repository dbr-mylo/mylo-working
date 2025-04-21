
import { ParameterCache } from './ParameterCache';
import { NestedParameterResult, ValidationResult, CacheMetrics } from '../types';

// Create cache instances
const extractionCache = new ParameterCache<NestedParameterResult>();
const validationCache = new ParameterCache<ValidationResult>();

/**
 * Clear all parameter caches
 */
export function clearParameterCaches(): void {
  extractionCache.clear();
  validationCache.clear();
}

/**
 * Get cache metrics for monitoring
 */
export function getParameterCacheMetrics(): {
  extraction: CacheMetrics;
  validation: CacheMetrics;
} {
  return {
    extraction: extractionCache.getMetrics(),
    validation: validationCache.getMetrics()
  };
}

// Export cache instances for use in memoized functions
export { extractionCache, validationCache };


import { NestedParameterResult, CacheOptions } from './types';
import { extractNestedParameters } from './nestedParameterHandler';
import { extractionCache } from './cache/parameter-cache-manager';
import { generateCacheKey } from './cache/hierarchy-utils';

/**
 * Enhanced memoized nested parameter extraction with advanced caching
 */
export function memoizedExtractNestedParameters(
  pattern: string, 
  path: string,
  options?: CacheOptions
): NestedParameterResult {
  const cacheKey = generateCacheKey(`${pattern}|${path}`, options);
  
  // Try to get from cache
  const cached = extractionCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Not in cache, perform extraction
  const startTime = performance.now();
  const result = extractNestedParameters(pattern, path);
  
  // Performance tracking
  if (!result.performance) {
    result.performance = { extractionTime: performance.now() - startTime };
  }
  
  // Store in cache
  extractionCache.set(cacheKey, result);
  
  return result;
}

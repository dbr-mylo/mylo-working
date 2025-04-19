
import { extractNestedParameters, validateNestedParameters, ValidationRuleBuilder } from './nestedParameterHandler';

/**
 * Cache for memoized parameter extraction results to improve performance
 */
const extractionCache = new Map<string, {
  params: Record<string, string>;
  hierarchy: Record<string, string[]>;
  errors: string[];
}>();

/**
 * Maximum size for parameter extraction cache to prevent memory leaks
 */
const MAX_CACHE_SIZE = 100;

/**
 * Generates a cache key for parameter extraction
 */
const generateCacheKey = (pattern: string, path: string): string => {
  return `${pattern}::${path}`;
};

/**
 * Memoized version of extractNestedParameters for improved performance
 * @param pattern Route pattern with parameters (e.g. '/user/:id/profile/:section')
 * @param path Actual path (e.g. '/user/123/profile/settings')
 * @returns Extracted parameters, hierarchy and any extraction errors
 */
export const memoizedExtractNestedParameters = (pattern: string, path: string) => {
  const cacheKey = generateCacheKey(pattern, path);
  
  // Check if we have a cached result
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey)!;
  }
  
  // No cached result, perform the extraction
  const result = extractNestedParameters(pattern, path);
  
  // Manage cache size to prevent memory leaks
  if (extractionCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry (first key in map)
    const firstKey = extractionCache.keys().next().value;
    extractionCache.delete(firstKey);
  }
  
  // Store result in cache
  extractionCache.set(cacheKey, result);
  
  return result;
};

/**
 * Cache for validation results to improve performance
 */
const validationCache = new Map<string, {
  isValid: boolean;
  errors: string[];
}>();

/**
 * Generates a cache key for parameter validation
 */
const generateValidationCacheKey = (
  params: Record<string, string>,
  hierarchy: Record<string, string[]>,
  rules?: Record<string, any>
): string => {
  return `${JSON.stringify(params)}::${JSON.stringify(hierarchy)}::${JSON.stringify(rules || {})}`;
};

/**
 * Memoized version of validateNestedParameters for improved performance
 */
export const memoizedValidateNestedParameters = (
  params: Record<string, string>,
  hierarchy: Record<string, string[]>,
  rules?: Record<string, any>
) => {
  const cacheKey = generateValidationCacheKey(params, hierarchy, rules);
  
  // Check if we have a cached result
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  
  // No cached result, perform the validation
  const result = validateNestedParameters(params, hierarchy, rules);
  
  // Manage cache size
  if (validationCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = validationCache.keys().next().value;
    validationCache.delete(firstKey);
  }
  
  // Store result in cache
  validationCache.set(cacheKey, result);
  
  return result;
};

/**
 * Clear all caches - useful for testing or when rules change
 */
export const clearParameterCaches = () => {
  extractionCache.clear();
  validationCache.clear();
};

// Re-export ValidationRuleBuilder for convenience
export { ValidationRuleBuilder };

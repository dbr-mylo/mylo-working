
import { 
  NestedParameter, 
  ValidationRule, 
  ValidationResult, 
  SimplifiedHierarchy,
  CacheOptions 
} from './types';
import { validateNestedParameters } from './nestedParameterHandler';
import { validationCache } from './cache/parameter-cache-manager';
import { generateCacheKey, convertToNestedParameters } from './cache/hierarchy-utils';

/**
 * Enhanced memoized parameter validation with advanced caching
 */
export function memoizedValidateNestedParameters(
  params: Record<string, string>,
  hierarchy: Record<string, NestedParameter> | SimplifiedHierarchy,
  rules?: Record<string, ValidationRule>,
  options?: CacheOptions
): ValidationResult {
  // Generate cache key
  const paramsKey = JSON.stringify(params);
  const hierarchyKey = JSON.stringify(hierarchy);
  const rulesKey = rules ? JSON.stringify(Object.keys(rules)) : 'no-rules';
  const cacheKey = generateCacheKey(`${paramsKey}|${hierarchyKey}`, { rules: rulesKey });
  
  // Try to get from cache
  const cached = validationCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Convert hierarchy if simplified version was provided
  let fullHierarchy: Record<string, NestedParameter>;
  
  if (Object.values(hierarchy).every(val => Array.isArray(val))) {
    // This is a simplified hierarchy
    fullHierarchy = convertToNestedParameters(hierarchy as SimplifiedHierarchy);
  } else {
    // This is already a full hierarchy
    fullHierarchy = hierarchy as Record<string, NestedParameter>;
  }
  
  // Perform validation
  const startTime = performance.now();
  const validationResult = validateNestedParameters(params, fullHierarchy, rules);
  const endTime = performance.now();
  
  // Prepare result object
  const result: ValidationResult = {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    performance: {
      validationTime: endTime - startTime
    }
  };
  
  // Store in cache
  validationCache.set(cacheKey, result);
  
  return result;
}

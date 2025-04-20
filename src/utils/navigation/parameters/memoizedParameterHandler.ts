
import { extractNestedParameters, validateNestedParameters } from './nestedParameterHandler';
import { 
  NestedParameter, 
  NestedParameterResult, 
  ValidationRule, 
  SimplifiedHierarchy,
  CacheOptions,
  CacheMetrics,
  CacheEntry,
  ValidationResult
} from './types';

// Default cache configuration
const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxSize: 100,
  ttl: 5 * 60 * 1000 // 5 minutes
};

// Cache for extraction results
class ParameterCache<T> {
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

// Create cache instances
const extractionCache = new ParameterCache<NestedParameterResult>();
const validationCache = new ParameterCache<ValidationResult>();

/**
 * Convert simplified hierarchy to full NestedParameter structure
 * for compatibility with validation functions
 */
function convertToNestedParameters(simplified: SimplifiedHierarchy): Record<string, NestedParameter> {
  const result: Record<string, NestedParameter> = {};
  
  // First pass to create basic structure
  Object.keys(simplified).forEach(key => {
    result[key] = {
      name: key,
      isOptional: false, // Default, will be updated in second pass
      children: simplified[key],
      level: 0 // Will be calculated in second pass
    };
  });
  
  // Second pass to set parent references and calculate levels
  Object.keys(simplified).forEach(key => {
    const children = simplified[key];
    
    children.forEach(childName => {
      if (result[childName]) {
        result[childName].parent = key;
        result[childName].level = (result[key].level || 0) + 1;
      }
    });
  });

  return result;
}

/**
 * Convert full NestedParameter hierarchy to simplified format
 * for more efficient caching
 */
function simplifyHierarchy(hierarchy: Record<string, NestedParameter>): SimplifiedHierarchy {
  const simplified: SimplifiedHierarchy = {};
  
  Object.keys(hierarchy).forEach(key => {
    simplified[key] = hierarchy[key].children;
  });
  
  return simplified;
}

/**
 * Generate a cache key for parameters and rules
 */
function generateCacheKey(base: string, params?: Record<string, any>): string {
  if (!params) return base;
  
  // Simple deterministic serialization for cache keys
  const paramStr = Object.keys(params)
    .sort()
    .map(k => `${k}:${String(params[k])}`)
    .join('|');
  
  return `${base}|${paramStr}`;
}

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

// Export for backwards compatibility
export { 
  ValidationRuleBuilder 
} from './ValidationRuleBuilder';

export type { 
  NestedParameter, 
  NestedParameterResult, 
  ValidationRule,
  ValidationResult,
  CacheMetrics
};

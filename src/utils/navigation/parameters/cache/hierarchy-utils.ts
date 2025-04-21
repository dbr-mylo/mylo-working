
import { NestedParameter, SimplifiedHierarchy } from '../types';

/**
 * Convert simplified hierarchy to full NestedParameter structure
 * for compatibility with validation functions
 */
export function convertToNestedParameters(simplified: SimplifiedHierarchy): Record<string, NestedParameter> {
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
export function simplifyHierarchy(hierarchy: Record<string, NestedParameter>): SimplifiedHierarchy {
  const simplified: SimplifiedHierarchy = {};
  
  Object.keys(hierarchy).forEach(key => {
    simplified[key] = hierarchy[key].children;
  });
  
  return simplified;
}

/**
 * Generate a cache key for parameters and rules
 */
export function generateCacheKey(base: string, params?: Record<string, any>): string {
  if (!params) return base;
  
  // Simple deterministic serialization for cache keys
  const paramStr = Object.keys(params)
    .sort()
    .map(k => `${k}:${String(params[k])}`)
    .join('|');
  
  return `${base}|${paramStr}`;
}

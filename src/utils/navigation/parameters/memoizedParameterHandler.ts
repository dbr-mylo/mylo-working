
import { extractNestedParameters, validateNestedParameters, type NestedParameter } from './nestedParameterHandler';

interface MemoizedResult {
  params: Record<string, string>;
  hierarchy: Record<string, string[]>;
  errors: string[];
}

// Memoization caches
const extractionCache = new Map<string, MemoizedResult>();
const validationCache = new Map<string, { isValid: boolean; errors: string[] }>();

export const memoizedExtractNestedParameters = (pattern: string, path: string): MemoizedResult => {
  const cacheKey = `${pattern}|${path}`;
  
  if (extractionCache.has(cacheKey)) {
    return extractionCache.get(cacheKey)!;
  }
  
  const result = extractNestedParameters(pattern, path);
  const memoizedResult: MemoizedResult = {
    params: result.params,
    hierarchy: Object.entries(result.hierarchy).reduce((acc, [key, value]) => {
      acc[key] = value.children;
      return acc;
    }, {} as Record<string, string[]>),
    errors: [...result.errors, result.missingRequired.map(p => `Missing required parameter: ${p}`)]
  };
  
  extractionCache.set(cacheKey, memoizedResult);
  return memoizedResult;
};

export const memoizedValidateNestedParameters = (
  params: Record<string, string>,
  hierarchy: Record<string, string[]>,
  rules?: Record<string, any>
) => {
  const cacheKey = `${JSON.stringify(params)}|${JSON.stringify(hierarchy)}|${JSON.stringify(rules)}`;
  
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  
  // Convert hierarchy from Record<string, string[]> to Record<string, NestedParameter>
  // This is necessary because validateNestedParameters expects NestedParameter objects
  const convertedHierarchy = Object.entries(hierarchy).reduce((acc, [key, children]) => {
    acc[key] = {
      name: key,
      isOptional: false, // Default to false, can't determine from the string[] format
      children,
      level: 0 // Default to 0, can't determine from the string[] format
    };
    return acc;
  }, {} as Record<string, NestedParameter>);
  
  const validationResult = validateNestedParameters(params, convertedHierarchy, rules);
  validationCache.set(cacheKey, { isValid: validationResult.isValid, errors: validationResult.errors });
  return validationResult;
};

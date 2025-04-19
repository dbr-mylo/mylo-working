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
    errors: result.errors
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
  
  const validationResult = validateNestedParameters(params, hierarchy, rules);
  validationCache.set(cacheKey, { isValid: validationResult.isValid, errors: validationResult.errors });
  return validationResult;
};

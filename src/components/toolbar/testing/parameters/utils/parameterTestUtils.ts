
import { navigationService } from '@/services/navigation/NavigationService';

/**
 * Test cases for parameter extraction
 */
export const PARAMETER_TEST_CASES = {
  simple: {
    pattern: '/user/:id',
    actual: '/user/123',
    expected: { id: '123' }
  },
  multiple: {
    pattern: '/content/:type/:id',
    actual: '/content/article/123',
    expected: { type: 'article', id: '123' }
  },
  complex: {
    pattern: '/org/:orgId/project/:projectId/task/:taskId',
    actual: '/org/org-123/project/proj-456/task/task-789',
    expected: {
      orgId: 'org-123',
      projectId: 'proj-456',
      taskId: 'task-789'
    }
  },
  specialChars: {
    pattern: '/user/:username',
    actual: '/user/jöhn.doe+work',
    expected: { username: 'jöhn.doe+work' }
  },
  encoded: {
    pattern: '/search/:query',
    actual: '/search/react%20components',
    expected: { query: 'react%20components' }
  }
};

/**
 * Extract parameters from a route pattern and actual path
 */
export const extractParameters = (pattern: string, actual: string) => {
  return navigationService.extractRouteParameters(pattern, actual);
};

/**
 * Generate a deep link with parameters and query parameters
 */
export const generateDeepLink = (
  path: string, 
  params: Record<string, string> = {}, 
  query: Record<string, string> = {}
) => {
  let processedPath = path;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    processedPath = processedPath.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters if any
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    ).toString();
    
    if (queryString) {
      processedPath = `${processedPath}${processedPath.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  return processedPath;
};

/**
 * Validate parameters match expected values
 */
export const validateParameters = (
  actual: Record<string, string> | null, 
  expected: Record<string, string>
): { valid: boolean; mismatches: string[] } => {
  if (!actual) {
    return { valid: false, mismatches: ['Parameters could not be extracted'] };
  }
  
  const mismatches: string[] = [];
  
  // Check if all expected keys exist with correct values
  Object.entries(expected).forEach(([key, value]) => {
    if (!(key in actual)) {
      mismatches.push(`Missing expected parameter: ${key}`);
    } else if (actual[key] !== value) {
      mismatches.push(`Parameter ${key} has value "${actual[key]}" but expected "${value}"`);
    }
  });
  
  // Check for unexpected parameters
  Object.keys(actual).forEach(key => {
    if (!(key in expected)) {
      mismatches.push(`Unexpected parameter: ${key}`);
    }
  });
  
  return { valid: mismatches.length === 0, mismatches };
};

/**
 * Benchmark execution time of a function
 */
export const benchmarkFunction = <T>(fn: () => T): { result: T; executionTime: number } => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, executionTime: end - start };
};

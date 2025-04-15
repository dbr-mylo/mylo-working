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
  },
  edgeCases: {
    pattern: '/user/:id/profile/:section',
    actual: '/user/123/profile/',
    expected: null
  },
  unicode: {
    pattern: '/blog/:category/:title',
    actual: '/blog/café/español-artículo',
    expected: {
      category: 'café',
      title: 'español-artículo'
    }
  },
  complexNesting: {
    pattern: '/org/:orgId/team/:teamId/project/:projectId/task/:taskId',
    actual: '/org/org-123/team/team-456/project/proj-789/task/task-101',
    expected: {
      orgId: 'org-123',
      teamId: 'team-456',
      projectId: 'proj-789',
      taskId: 'task-101'
    }
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
): { valid: boolean; mismatches: string[]; warnings: string[] } => {
  const mismatches: string[] = [];
  const warnings: string[] = [];
  
  if (!actual) {
    return { 
      valid: false, 
      mismatches: ['Parameters could not be extracted'], 
      warnings: [] 
    };
  }
  
  // Check if all expected keys exist with correct values
  Object.entries(expected).forEach(([key, value]) => {
    if (!(key in actual)) {
      mismatches.push(`Missing expected parameter: ${key}`);
    } else if (actual[key] !== value) {
      mismatches.push(`Parameter ${key} has value "${actual[key]}" but expected "${value}"`);
    }
    
    // Check for potential encoding issues
    if (actual[key] && actual[key].includes('%')) {
      warnings.push(`Parameter ${key} might need URL decoding`);
    }
  });
  
  // Check for unexpected parameters
  Object.keys(actual).forEach(key => {
    if (!(key in expected)) {
      mismatches.push(`Unexpected parameter: ${key}`);
    }
  });
  
  return { 
    valid: mismatches.length === 0, 
    mismatches, 
    warnings 
  };
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

/**
 * Run performance benchmarking
 */
export const runPerformanceBenchmark = (
  testFn: () => void,
  iterations: number = 1000
): { averageTime: number; maxTime: number; minTime: number } => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    testFn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    averageTime: times.reduce((a, b) => a + b, 0) / times.length,
    maxTime: Math.max(...times),
    minTime: Math.min(...times)
  };
};

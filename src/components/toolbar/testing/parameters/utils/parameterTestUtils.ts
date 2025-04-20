
import { 
  extractNestedParameters, 
  validateNestedParameters 
} from '@/utils/navigation/parameters/nestedParameterHandler';
import { 
  memoizedExtractNestedParameters, 
  memoizedValidateNestedParameters 
} from '@/utils/navigation/parameters/memoizedParameterHandler';
import { benchmarkFunction } from '@/utils/navigation/parameters/performanceMonitor';

// Test cases for parameter extraction scenarios
export const PARAMETER_TEST_CASES = {
  simple: {
    pattern: '/users/:id',
    actual: '/users/123',
    expected: { id: '123' }
  },
  optional: {
    pattern: '/products/:category?/:id',
    actual: '/products//abc123',
    expected: { category: '', id: 'abc123' }
  },
  multiple: {
    pattern: '/org/:orgId/team/:teamId/project/:projectId',
    actual: '/org/org-123/team/team-456/project/proj-789',
    expected: { orgId: 'org-123', teamId: 'team-456', projectId: 'proj-789' }
  },
  nested: {
    pattern: '/content/:contentType/:articleId/version/:versionId',
    actual: '/content/blog/abc-123/version/v2',
    expected: { contentType: 'blog', articleId: 'abc-123', versionId: 'v2' }
  },
  complex: {
    pattern: '/shop/:department/:category?/:subcategory?/:productId',
    actual: '/shop/electronics/computers/laptops/macbook-pro',
    expected: { 
      department: 'electronics', 
      category: 'computers', 
      subcategory: 'laptops', 
      productId: 'macbook-pro' 
    }
  }
};

/**
 * Extract parameters from a URL pattern and actual path
 */
export const extractParameters = (
  pattern: string, 
  actualPath: string,
  useMemoization: boolean = false
): Record<string, string> | null => {
  try {
    if (useMemoization) {
      const result = memoizedExtractNestedParameters(pattern, actualPath);
      return result.params;
    } else {
      const result = extractNestedParameters(pattern, actualPath);
      return result.params;
    }
  } catch (error) {
    console.error('Error extracting parameters:', error);
    return null;
  }
};

/**
 * Validate extracted parameters against expected values
 */
export const validateParameters = (
  extracted: Record<string, string>,
  expected: Record<string, string>
): { valid: boolean; mismatches: string[] } => {
  const mismatches: string[] = [];
  
  Object.keys(expected).forEach(key => {
    if (!(key in extracted)) {
      mismatches.push(`Missing parameter: ${key}`);
    } else if (extracted[key] !== expected[key]) {
      mismatches.push(`Mismatch for ${key}: expected "${expected[key]}", got "${extracted[key]}"`);
    }
  });
  
  return {
    valid: mismatches.length === 0,
    mismatches
  };
};

/**
 * Benchmark function with performance monitoring
 */
export const benchmarkFunction = <T>(
  fn: () => T, 
  iterations: number = 1
): { result: T; executionTime: number } => {
  const { result, performance } = benchmarkFunction('parameterTest', fn, iterations);
  return { result, executionTime: performance.executionTime };
};

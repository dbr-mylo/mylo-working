
export const EDGE_CASE_TEST_SCENARIOS = {
  emptyParams: {
    pattern: '/user/:id/',
    actual: '/user//',
    expected: null,
    description: 'Empty parameter value'
  },
  malformedUrl: {
    pattern: '/user/:id',
    actual: '/user/123/extra',
    expected: null,
    description: 'Mismatched segment count'
  },
  specialChars: {
    pattern: '/user/:name/:email',
    actual: '/user/John%20Doe/john%2B.doe%40example.com',
    expected: {
      name: 'John Doe',
      email: 'john+.doe@example.com'
    },
    description: 'Special characters and encoding'
  },
  unicodeChars: {
    pattern: '/content/:title/:language',
    actual: '/content/café/español',
    expected: {
      title: 'café',
      language: 'español'
    },
    description: 'Unicode character handling'
  },
  multipleEmpty: {
    pattern: '/org/:orgId/user/:userId',
    actual: '/org//user/',
    expected: null,
    description: 'Multiple empty parameters'
  }
};

export const validateEdgeCaseScenario = (
  pattern: string,
  actual: string,
  expected: Record<string, string> | null
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for empty segments
  if (actual.includes('//')) {
    errors.push('Path contains empty segments');
  }
  
  // Check segment count match
  const patternSegments = pattern.split('/').filter(Boolean);
  const actualSegments = actual.split('/').filter(Boolean);
  
  if (patternSegments.length !== actualSegments.length) {
    errors.push('Pattern and actual path have different segment counts');
  }
  
  // Validate parameter names
  const paramNames = patternSegments
    .filter(segment => segment.startsWith(':'))
    .map(segment => segment.slice(1));
  
  if (expected) {
    const missingParams = paramNames.filter(name => !(name in expected));
    if (missingParams.length > 0) {
      errors.push(`Missing expected parameters: ${missingParams.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const performanceTest = (
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

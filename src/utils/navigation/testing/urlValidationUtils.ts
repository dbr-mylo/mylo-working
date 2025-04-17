
/**
 * Utilities for testing URL validation and edge cases
 */

/**
 * Types of URL validation errors
 */
export enum URLValidationErrorType {
  EMPTY_PATH = 'EMPTY_PATH',
  INVALID_PATH_FORMAT = 'INVALID_PATH_FORMAT',
  INVALID_CHARACTERS = 'INVALID_CHARACTERS',
  PATH_TOO_LONG = 'PATH_TOO_LONG',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  PARAMETER_TYPE_MISMATCH = 'PARAMETER_TYPE_MISMATCH',
  DUPLICATE_PARAMETER = 'DUPLICATE_PARAMETER'
}

/**
 * Result of URL validation
 */
export interface URLValidationResult {
  isValid: boolean;
  normalizedPath?: string;
  errorType?: URLValidationErrorType;
  errorMessage?: string;
  performanceMetrics?: {
    executionTime: number;
    memoryUsage?: number;
  };
}

/**
 * Test scenario for malformed URLs
 */
export interface MalformedURLScenario {
  name: string;
  description: string;
  input: string;
  expected: {
    isValid: boolean;
    normalizedPath?: string;
    errorType?: URLValidationErrorType;
    errorMessage?: string;
  };
}

/**
 * Common malformed URL test scenarios
 */
export const MALFORMED_URL_SCENARIOS: Record<string, MalformedURLScenario> = {
  emptyPath: {
    name: 'Empty Path',
    description: 'Test handling of empty paths',
    input: '',
    expected: {
      isValid: false,
      errorType: URLValidationErrorType.EMPTY_PATH,
      errorMessage: 'Path cannot be empty'
    }
  },
  doubleSlashes: {
    name: 'Double Slashes',
    description: 'Test handling of paths with double slashes',
    input: '/user//profile',
    expected: {
      isValid: false,
      errorType: URLValidationErrorType.INVALID_PATH_FORMAT,
      errorMessage: 'Path contains double slashes'
    }
  },
  trailingSlash: {
    name: 'Trailing Slash',
    description: 'Test handling of paths with trailing slashes',
    input: '/user/profile/',
    expected: {
      isValid: true,
      normalizedPath: '/user/profile',
    }
  },
  unusualCharacters: {
    name: 'Unusual Characters',
    description: 'Test handling of paths with unusual characters',
    input: '/user/@#$%/profile',
    expected: {
      isValid: false,
      errorType: URLValidationErrorType.INVALID_CHARACTERS,
      errorMessage: 'Path contains invalid characters'
    }
  },
  longPath: {
    name: 'Long Path',
    description: 'Test handling of very long paths',
    input: '/' + 'a'.repeat(1000),
    expected: {
      isValid: false,
      errorType: URLValidationErrorType.PATH_TOO_LONG,
      errorMessage: 'Path exceeds maximum length'
    }
  },
  rootPath: {
    name: 'Root Path',
    description: 'Test handling of root path',
    input: '/',
    expected: {
      isValid: true,
      normalizedPath: '/',
    }
  }
};

/**
 * Validate URL path format
 * @param path URL path to validate
 * @returns Validation result
 */
export function validateURLPath(path: string): URLValidationResult {
  const startTime = performance.now();
  
  // Check for empty path
  if (!path) {
    return {
      isValid: false,
      errorType: URLValidationErrorType.EMPTY_PATH,
      errorMessage: 'Path cannot be empty',
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Check for double slashes
  if (path.includes('//')) {
    return {
      isValid: false,
      errorType: URLValidationErrorType.INVALID_PATH_FORMAT,
      errorMessage: 'Path contains double slashes',
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Check path length
  if (path.length > 500) {
    return {
      isValid: false,
      errorType: URLValidationErrorType.PATH_TOO_LONG,
      errorMessage: 'Path exceeds maximum length',
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Check for invalid characters
  const validPathPattern = /^\/[a-zA-Z0-9\/_\-:.]*$/;
  if (!validPathPattern.test(path)) {
    return {
      isValid: false,
      errorType: URLValidationErrorType.INVALID_CHARACTERS,
      errorMessage: 'Path contains invalid characters',
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Normalize trailing slashes
  let normalizedPath = path;
  if (path.length > 1 && path.endsWith('/')) {
    normalizedPath = path.slice(0, -1);
  }
  
  return {
    isValid: true,
    normalizedPath,
    performanceMetrics: {
      executionTime: performance.now() - startTime
    }
  };
}

/**
 * Run all predefined URL validation test scenarios
 * @returns Results of all test scenarios
 */
export function runAllURLTests(): Record<string, URLValidationResult> {
  const results: Record<string, URLValidationResult> = {};
  
  Object.entries(MALFORMED_URL_SCENARIOS).forEach(([key, scenario]) => {
    results[key] = validateURLPath(scenario.input);
  });
  
  return results;
}

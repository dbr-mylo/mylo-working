
/**
 * Utilities for testing parameter validation and edge cases
 */

/**
 * Parameter validation rule
 */
export interface ParameterValidationRule {
  type: 'string' | 'number' | 'uuid' | 'email' | 'custom';
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => boolean;
  required?: boolean;
}

/**
 * Parameter sanitization rule
 */
export interface ParameterSanitizationRule {
  trim?: boolean;
  lowercase?: boolean;
  removeSpecialChars?: boolean;
  customTransform?: (value: string) => string;
}

/**
 * Parameter test case
 */
export interface ParameterTestCase {
  routePattern: string;
  actualPath: string;
  expectedParams: Record<string, string> | null;
  expectedErrors?: string[];
}

/**
 * Parameter validation test scenario
 */
export interface ParameterValidationScenario {
  name: string;
  description: string;
  rule: ParameterValidationRule;
  testCases: {
    input: string;
    expected: boolean;
    errorMessage?: string;
  }[];
}

/**
 * Common parameter validation test scenarios
 */
export const PARAMETER_VALIDATION_SCENARIOS: Record<string, ParameterValidationScenario> = {
  numeric: {
    name: 'Numeric Parameter',
    description: 'Validate numeric parameters',
    rule: {
      type: 'number',
      required: true
    },
    testCases: [
      { input: '123', expected: true },
      { input: 'abc', expected: false, errorMessage: 'Parameter must be numeric' },
      { input: '', expected: false, errorMessage: 'Parameter is required' }
    ]
  },
  uuid: {
    name: 'UUID Parameter',
    description: 'Validate UUID parameters',
    rule: {
      type: 'uuid',
      required: true
    },
    testCases: [
      { input: '550e8400-e29b-41d4-a716-446655440000', expected: true },
      { input: 'invalid-uuid', expected: false, errorMessage: 'Parameter must be a valid UUID' }
    ]
  },
  email: {
    name: 'Email Parameter',
    description: 'Validate email parameters',
    rule: {
      type: 'email',
      required: false
    },
    testCases: [
      { input: 'test@example.com', expected: true },
      { input: 'invalid-email', expected: false, errorMessage: 'Parameter must be a valid email' },
      { input: '', expected: true } // Not required
    ]
  },
  length: {
    name: 'Length Validation',
    description: 'Validate parameter length constraints',
    rule: {
      type: 'string',
      minLength: 3,
      maxLength: 10
    },
    testCases: [
      { input: 'abc', expected: true },
      { input: 'abcdefghij', expected: true },
      { input: 'ab', expected: false, errorMessage: 'Parameter must be at least 3 characters' },
      { input: 'abcdefghijk', expected: false, errorMessage: 'Parameter cannot exceed 10 characters' }
    ]
  }
};

/**
 * Missing parameter test scenario
 */
export interface MissingParameterScenario {
  name: string;
  description: string;
  routePattern: string;
  testCases: {
    actualPath: string;
    expectedParams: Record<string, string> | null;
    expectedErrors?: string[];
  }[];
}

/**
 * Common missing parameter test scenarios
 */
export const MISSING_PARAMETER_SCENARIOS: Record<string, MissingParameterScenario> = {
  missingRequired: {
    name: 'Missing Required Parameter',
    description: 'Test handling of missing required parameters',
    routePattern: '/user/:id/profile',
    testCases: [
      { 
        actualPath: '/user//profile', 
        expectedParams: null,
        expectedErrors: ['Missing required parameter: id']
      },
      { 
        actualPath: '/user/profile', 
        expectedParams: null,
        expectedErrors: ['Path segments do not match pattern']
      }
    ]
  },
  optionalParameters: {
    name: 'Optional Parameters',
    description: 'Test handling of optional parameters',
    routePattern: '/post/:id?/comments/:commentId?',
    testCases: [
      { 
        actualPath: '/post//comments', 
        expectedParams: {
          id: '',
          commentId: ''
        }
      },
      { 
        actualPath: '/post/123/comments/', 
        expectedParams: {
          id: '123',
          commentId: ''
        }
      }
    ]
  },
  parameterConflict: {
    name: 'Parameter Name Conflict',
    description: 'Test handling of parameter name conflicts',
    routePattern: '/user/:id/posts/:id',
    testCases: [
      {
        actualPath: '/user/123/posts/456',
        expectedParams: null,
        expectedErrors: ['Duplicate parameter name: id']
      }
    ]
  }
};

/**
 * Validate a parameter based on a rule
 * @param name Parameter name
 * @param value Parameter value
 * @param rule Validation rule
 * @returns Validation result
 */
export function validateParameter(
  name: string,
  value: string,
  rule: ParameterValidationRule
): { isValid: boolean; errorMessage?: string; sanitizedValue?: string } {
  // Check required
  if (rule.required && !value) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} is required`
    };
  }
  
  // Skip validation for optional empty parameters
  if (!rule.required && !value) {
    return {
      isValid: true,
      sanitizedValue: ''
    };
  }
  
  // Validate by type
  switch (rule.type) {
    case 'number':
      if (!/^\d+$/.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be numeric`
        };
      }
      break;
      
    case 'uuid':
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be a valid UUID`
        };
      }
      break;
      
    case 'email':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be a valid email`
        };
      }
      break;
  }
  
  // Check length constraints
  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} must be at least ${rule.minLength} characters`
    };
  }
  
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} cannot exceed ${rule.maxLength} characters`
    };
  }
  
  // Check custom pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} does not match required pattern`
    };
  }
  
  // Check custom validator
  if (rule.customValidator && !rule.customValidator(value)) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} failed custom validation`
    };
  }
  
  // Passed all validations
  return {
    isValid: true,
    sanitizedValue: value
  };
}

/**
 * Extract and validate parameters from a route
 * @param routePattern Route pattern with parameters
 * @param actualPath Actual path with values
 * @param validationRules Optional validation rules for parameters
 * @returns Extracted and validated parameters or null if invalid
 */
export function extractAndValidateParameters(
  routePattern: string,
  actualPath: string,
  validationRules?: Record<string, ParameterValidationRule>
): {
  isValid: boolean;
  params?: Record<string, string>;
  errors?: string[];
  performanceMetrics?: {
    executionTime: number;
  };
} {
  const startTime = performance.now();
  const errors: string[] = [];
  
  // Split into segments
  const patternSegments = routePattern.split('/').filter(Boolean);
  const pathSegments = actualPath.split('/').filter(Boolean);
  
  // Check if segment count matches (unless there are optional parameters)
  const hasOptionalParams = routePattern.includes('?');
  if (!hasOptionalParams && patternSegments.length !== pathSegments.length) {
    return {
      isValid: false,
      errors: ['Path segments do not match pattern'],
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Extract parameters
  const params: Record<string, string> = {};
  const paramNames = new Set<string>();
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    
    // Check if this is a parameter
    if (patternSegment.startsWith(':')) {
      // Get parameter name (remove : and optional ? marker)
      let paramName = patternSegment.substring(1);
      const isOptional = paramName.endsWith('?');
      if (isOptional) {
        paramName = paramName.substring(0, paramName.length - 1);
      }
      
      // Check for duplicate parameter names
      if (paramNames.has(paramName)) {
        errors.push(`Duplicate parameter name: ${paramName}`);
        continue;
      }
      
      paramNames.add(paramName);
      
      // Get parameter value
      const value = i < pathSegments.length ? pathSegments[i] : '';
      
      // Check if required parameter is missing
      if (!isOptional && !value) {
        errors.push(`Missing required parameter: ${paramName}`);
      }
      
      // Validate parameter if rules provided
      if (validationRules && validationRules[paramName]) {
        const validationResult = validateParameter(
          paramName,
          value,
          validationRules[paramName]
        );
        
        if (!validationResult.isValid) {
          errors.push(validationResult.errorMessage || `Invalid parameter: ${paramName}`);
        } else if (validationResult.sanitizedValue !== undefined) {
          params[paramName] = validationResult.sanitizedValue;
          continue;
        }
      }
      
      params[paramName] = value;
    }
    // If not a parameter, ensure static segments match
    else if (i < pathSegments.length && patternSegment !== pathSegments[i]) {
      errors.push(`Path segment mismatch: expected "${patternSegment}", got "${pathSegments[i]}"`);
    }
  }
  
  // Determine validity based on errors
  const isValid = errors.length === 0;
  
  return {
    isValid,
    params: isValid ? params : undefined,
    errors: errors.length > 0 ? errors : undefined,
    performanceMetrics: {
      executionTime: performance.now() - startTime
    }
  };
}

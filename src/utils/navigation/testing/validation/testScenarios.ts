
import { ParameterValidationScenario, MissingParameterScenario } from './types';

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

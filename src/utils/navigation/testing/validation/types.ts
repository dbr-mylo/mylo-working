
/**
 * Types for parameter validation
 */
export interface ParameterValidationRule {
  type: 'string' | 'number' | 'uuid' | 'email' | 'custom';
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => boolean;
  required?: boolean;
}

export interface ParameterSanitizationRule {
  trim?: boolean;
  lowercase?: boolean;
  removeSpecialChars?: boolean;
  customTransform?: (value: string) => string;
}

export interface ParameterTestCase {
  routePattern: string;
  actualPath: string;
  expectedParams: Record<string, string> | null;
  expectedErrors?: string[];
}

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

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string; 
  sanitizedValue?: string;
}

export interface ExtractValidateResult {
  isValid: boolean;
  params?: Record<string, string>;
  errors?: string[];
  performanceMetrics?: {
    executionTime: number;
  };
}

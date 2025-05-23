
/**
 * Types for the NavigationParameterTester component
 */
export interface TestResult {
  params: Record<string, string>;
  hierarchy?: Record<string, any>;
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  performance: {
    extractionTime: number;
    validationTime?: number;
    operationsPerSecond?: number;
  };
  timestamp: string | number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
  memoizedOperationsPerSecond?: number;
  pattern?: string;
  actualPath?: string;
}

export interface NavigationParameterTesterProps {
  onTestResult: (result: TestResult) => void;
}

export interface ParameterDefinition {
  name: string;
  type: string;
  isRequired: boolean;
  validation?: Record<string, any>;
}



export interface TestResult {
  timestamp: string;
  pattern: string;
  actualPath: string;
  params: Record<string, string>;
  errors: string[];
  hierarchy: Record<string, any>;
  isValid: boolean;
  performance: {
    extractionTime: number;
    operationsPerSecond: number;
  };
  memoizedExtractionTime?: number;
  memoizedOperationsPerSecond?: number;
}

export interface PathSegment {
  type: 'static' | 'param';
  name: string;
  value: string;
}

export interface NavigationParameterTesterProps {
  onTestResult?: (result: TestResult) => void;
}

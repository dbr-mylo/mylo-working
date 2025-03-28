
/**
 * Options for the useSmokeTest hook
 */
export interface SmokeTestOptions {
  /** Whether to run the test when the component mounts */
  runOnMount?: boolean;
  /** Whether to log the test result to the console */
  logResult?: boolean;
  /** Category for organizing tests */
  category?: string;
  /** Whether to send analytics data */
  trackAnalytics?: boolean;
  /** Any additional context to include with the test */
  context?: Record<string, any>;
}

/**
 * Result of a smoke test
 */
export interface SmokeTestResult {
  /** Whether the test passed */
  passed: boolean;
  /** Error message if the test failed */
  error?: string;
  /** Component that was tested */
  component: string;
  /** When the test was run */
  timestamp: string;
  /** How long the test took to run in ms */
  duration?: number;
  /** Any additional context for the test */
  context?: Record<string, any>;
}

/**
 * Test execution functions and utilities
 */
export interface SmokeTestExecution {
  /** Run a test manually */
  runTest: (testFn?: () => void, testContext?: Record<string, any>) => boolean;
  /** Test a specific feature */
  testFeature: (featureName: string, testFn: () => void, testContext?: Record<string, any>) => boolean;
  /** Report an error from a manual test */
  reportError: (error: unknown, feature?: string, testContext?: Record<string, any>) => void;
}

/**
 * Result state and access
 */
export interface SmokeTestResults {
  /** Whether the last test passed */
  lastTestPassed: boolean | null;
  /** The result of the last test */
  lastTestResult: SmokeTestResult | null;
  /** Get all test results for this component */
  getTestResults: () => SmokeTestResult[];
}

/**
 * Component metadata
 */
export interface SmokeTestMetadata {
  /** Name of the component being tested */
  componentName: string;
  /** Category of the test */
  category: string;
}

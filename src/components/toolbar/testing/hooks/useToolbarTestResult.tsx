
export interface TestResult {
  passed: boolean;
  message: string;
  details?: string;
  name?: string;
  timestamp?: string;
}

export const createTestResult = (
  passed: boolean, 
  message: string, 
  details?: string
): TestResult => {
  return { passed, message, details };
};

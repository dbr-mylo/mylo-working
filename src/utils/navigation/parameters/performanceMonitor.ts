/**
 * Performance monitoring utilities for parameter testing
 */

export interface PerformanceResult {
  operationName: string;
  executionTime: number;
  operationsPerSecond: number;
  sampleSize: number;
  timestamp: number;
}

export interface PerformanceSnapshot {
  results: PerformanceResult[];
  averageExecutionTime: number;
  totalOperations: number;
  startTime: number;
  endTime: number;
}

/**
 * Store for historical performance data
 */
const performanceHistory: PerformanceResult[] = [];

/**
 * Maximum number of performance records to store
 */
const MAX_HISTORY_SIZE = 100;

/**
 * Benchmark a function's performance
 * @param operationName Name of the operation being benchmarked
 * @param fn Function to benchmark
 * @param iterations Number of iterations to run
 * @returns Performance result with timing data
 */
export const benchmarkOperation = <T>(
  operationName: string,
  fn: () => T,
  iterations: number = 100
): { result: T; performance: PerformanceResult } => {
  const startTime = performance.now();
  let result: T = null as unknown as T;
  
  for (let i = 0; i < iterations; i++) {
    if (i === iterations - 1) {
      // Save the last result
      result = fn();
    } else {
      fn();
    }
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const operationsPerSecond = Math.round((iterations / executionTime) * 1000);
  
  const performanceResult: PerformanceResult = {
    operationName,
    executionTime,
    operationsPerSecond,
    sampleSize: iterations,
    timestamp: Date.now()
  };
  
  // Store in history
  addToHistory(performanceResult);
  
  return { result, performance: performanceResult };
};

/**
 * Add a performance result to history
 */
const addToHistory = (result: PerformanceResult): void => {
  performanceHistory.unshift(result);
  
  // Maintain maximum size
  if (performanceHistory.length > MAX_HISTORY_SIZE) {
    performanceHistory.pop();
  }
};

/**
 * Get performance history for a specific operation
 */
export const getOperationHistory = (operationName: string): PerformanceResult[] => {
  return performanceHistory.filter(result => result.operationName === operationName);
};

/**
 * Get all performance history
 */
export const getAllPerformanceHistory = (): PerformanceResult[] => {
  return [...performanceHistory];
};

/**
 * Create a performance snapshot for multiple operations
 */
export const createPerformanceSnapshot = (operations: PerformanceResult[]): PerformanceSnapshot => {
  const totalOperations = operations.reduce((sum, op) => sum + op.sampleSize, 0);
  const totalExecutionTime = operations.reduce((sum, op) => sum + op.executionTime, 0);
  const averageExecutionTime = totalExecutionTime / operations.length;
  
  const timestamps = operations.map(op => op.timestamp);
  const startTime = Math.min(...timestamps);
  const endTime = Math.max(...timestamps);
  
  return {
    results: operations,
    averageExecutionTime,
    totalOperations,
    startTime,
    endTime
  };
};

/**
 * Clear all performance history
 */
export const clearPerformanceHistory = (): void => {
  performanceHistory.length = 0;
};

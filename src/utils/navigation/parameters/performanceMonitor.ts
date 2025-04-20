
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

// Alias for benchmarkOperation to maintain backwards compatibility
export const benchmarkFunction = benchmarkOperation;

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
 * Get recent performance history, limited to specified count
 */
export const getRecentPerformanceHistory = (count: number = 100): PerformanceResult[] => {
  return performanceHistory.slice(0, Math.min(count, performanceHistory.length));
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
 * Compare performance between two operations
 */
export const comparePerformance = (
  operation1Name: string,
  operation2Name: string
): {
  operation1: { averageExecutionTime: number; samples: number };
  operation2: { averageExecutionTime: number; samples: number };
  improvement: { time: number; percentage: number };
} => {
  const op1History = getOperationHistory(operation1Name);
  const op2History = getOperationHistory(operation2Name);
  
  const op1AvgTime = op1History.length > 0 
    ? op1History.reduce((sum, item) => sum + item.executionTime, 0) / op1History.length
    : 0;
    
  const op2AvgTime = op2History.length > 0
    ? op2History.reduce((sum, item) => sum + item.executionTime, 0) / op2History.length
    : 0;
    
  // Calculate improvement (negative means op2 is faster)
  const timeDiff = op1AvgTime - op2AvgTime;
  const percentageImprovement = op1AvgTime > 0
    ? (timeDiff / op1AvgTime) * 100
    : 0;
    
  return {
    operation1: {
      averageExecutionTime: op1AvgTime,
      samples: op1History.length
    },
    operation2: {
      averageExecutionTime: op2AvgTime,
      samples: op2History.length
    },
    improvement: {
      time: timeDiff,
      percentage: percentageImprovement
    }
  };
};

/**
 * Create combined metrics from cache info and performance data
 */
export const createCombinedMetrics = (
  cacheInfo: { hits: number; misses: number; size: number },
  performanceData: PerformanceResult[]
): {
  cacheEfficiency: number;
  averageExecutionTime: number;
  estimatedTimeSaved: number;
  totalOperations: number;
} => {
  const totalCacheAccesses = cacheInfo.hits + cacheInfo.misses;
  const cacheEfficiency = totalCacheAccesses > 0 
    ? (cacheInfo.hits / totalCacheAccesses) * 100
    : 0;
    
  const avgExecTime = performanceData.length > 0
    ? performanceData.reduce((sum, item) => sum + item.executionTime, 0) / performanceData.length
    : 0;
    
  const estimatedTimeSaved = cacheInfo.hits * avgExecTime;
  
  const totalOps = performanceData.reduce((sum, item) => sum + item.sampleSize, 0);
  
  return {
    cacheEfficiency,
    averageExecutionTime: avgExecTime,
    estimatedTimeSaved,
    totalOperations: totalOps
  };
};

/**
 * Clear all performance history
 */
export const clearPerformanceHistory = (): void => {
  performanceHistory.length = 0;
};

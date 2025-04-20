
import { CacheMetrics } from './types';

/**
 * Enhanced performance monitoring for parameter operations
 */
export interface PerformanceResult {
  operationName: string;
  executionTime: number;
  operationsPerSecond: number;
  sampleSize: number;
  timestamp: number;
  memoryUsage?: {
    heapUsed?: number;
    heapTotal?: number;
    heapUsedDelta?: number;
  };
}

export interface PerformanceSnapshot {
  results: PerformanceResult[];
  averageExecutionTime: number;
  totalOperations: number;
  startTime: number;
  endTime: number;
}

// Performance history store
const performanceHistory: PerformanceResult[] = [];
const MAX_HISTORY_SIZE = 1000;
const RECENT_HISTORY_SIZE = 100;

/**
 * Get a memory snapshot if available
 */
function getMemorySnapshot(): { used: number; total: number } | null {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize
    };
  }
  return null;
}

/**
 * Benchmark a function's performance with memory tracking
 */
export function benchmarkFunction<T>(
  operationName: string,
  fn: () => T,
  iterations: number = 1
): { result: T; performance: PerformanceResult } {
  // Get initial memory snapshot
  const initialMemory = getMemorySnapshot();
  
  const startTime = performance.now();
  let result: T;
  
  for (let i = 0; i < iterations; i++) {
    if (i === iterations - 1) {
      // Save the result of the last iteration
      result = fn();
    } else {
      fn();
    }
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const operationsPerSecond = Math.round((iterations / executionTime) * 1000);
  
  // Get final memory snapshot
  const finalMemory = getMemorySnapshot();
  
  const performanceResult: PerformanceResult = {
    operationName,
    executionTime,
    operationsPerSecond,
    sampleSize: iterations,
    timestamp: Date.now()
  };
  
  // Add memory usage if available
  if (initialMemory && finalMemory) {
    performanceResult.memoryUsage = {
      heapUsed: finalMemory.used,
      heapTotal: finalMemory.total,
      heapUsedDelta: finalMemory.used - initialMemory.used
    };
  }
  
  // Add to history
  addToHistory(performanceResult);
  
  return { result: result!, performance: performanceResult };
}

/**
 * Add performance result to history
 */
function addToHistory(result: PerformanceResult): void {
  performanceHistory.unshift(result);
  
  // Maintain maximum history size
  if (performanceHistory.length > MAX_HISTORY_SIZE) {
    performanceHistory.pop();
  }
}

/**
 * Get performance history for a specific operation
 */
export function getOperationHistory(
  operationName: string,
  limit: number = RECENT_HISTORY_SIZE
): PerformanceResult[] {
  return performanceHistory
    .filter(result => result.operationName === operationName)
    .slice(0, limit);
}

/**
 * Get the most recent performance results
 */
export function getRecentPerformanceHistory(
  limit: number = RECENT_HISTORY_SIZE
): PerformanceResult[] {
  return performanceHistory.slice(0, limit);
}

/**
 * Get all performance history
 */
export function getAllPerformanceHistory(): PerformanceResult[] {
  return [...performanceHistory];
}

/**
 * Clear performance history
 */
export function clearPerformanceHistory(): void {
  performanceHistory.length = 0;
}

/**
 * Create a performance snapshot for trend analysis
 */
export function createPerformanceSnapshot(
  operations: PerformanceResult[]
): PerformanceSnapshot {
  if (operations.length === 0) {
    return {
      results: [],
      averageExecutionTime: 0,
      totalOperations: 0,
      startTime: Date.now(),
      endTime: Date.now()
    };
  }
  
  const totalOperations = operations.reduce((sum, op) => sum + op.sampleSize, 0);
  const totalTime = operations.reduce((sum, op) => sum + op.executionTime, 0);
  const averageExecutionTime = totalTime / operations.length;
  
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
}

/**
 * Compare performance between two operations
 */
export function comparePerformance(
  operation1: string,
  operation2: string,
  sampleSize: number = 50
): {
  operation1: PerformanceSnapshot;
  operation2: PerformanceSnapshot;
  improvement: {
    time: number;
    percentage: number;
  };
} {
  const history1 = getOperationHistory(operation1, sampleSize);
  const history2 = getOperationHistory(operation2, sampleSize);
  
  const snapshot1 = createPerformanceSnapshot(history1);
  const snapshot2 = createPerformanceSnapshot(history2);
  
  let timeDiff = snapshot1.averageExecutionTime - snapshot2.averageExecutionTime;
  let percentage = snapshot1.averageExecutionTime > 0 
    ? (timeDiff / snapshot1.averageExecutionTime) * 100
    : 0;
  
  return {
    operation1: snapshot1,
    operation2: snapshot2,
    improvement: {
      time: timeDiff,
      percentage
    }
  };
}

/**
 * Integrated monitoring for cache and performance
 */
export function createCombinedMetrics(
  cacheMetrics: CacheMetrics,
  performanceResults: PerformanceResult[]
): {
  cacheEfficiency: number;
  averageExecutionTime: number;
  estimatedTimeSaved: number;
} {
  const totalRequests = cacheMetrics.hits + cacheMetrics.misses;
  const cacheEfficiency = totalRequests > 0 ? (cacheMetrics.hits / totalRequests) * 100 : 0;
  
  const avgTime = performanceResults.length > 0
    ? performanceResults.reduce((sum, r) => sum + r.executionTime, 0) / performanceResults.length
    : 0;
  
  // Estimate time saved by cache hits
  const estimatedTimeSaved = avgTime * cacheMetrics.hits;
  
  return {
    cacheEfficiency,
    averageExecutionTime: avgTime,
    estimatedTimeSaved
  };
}

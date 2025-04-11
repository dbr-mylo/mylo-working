
/**
 * Memory usage monitoring utilities for performance testing
 * Note: This is a simplified version since browser memory APIs are limited
 */

/**
 * Estimates memory usage for objects
 * Note: This is an approximation and not completely accurate for all object types
 * @param object The object to measure
 * @returns Approximate size in bytes
 */
export function estimateObjectSize(object: any): number {
  const objectList = new Set();
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (value === null || value === undefined) {
      bytes += 4;
      continue;
    }

    // Skip if already counted to avoid circular references
    if (objectList.has(value)) continue;

    // Track objects to avoid counting them twice
    if (typeof value === 'object') {
      objectList.add(value);
    }

    // Handle different types
    switch (typeof value) {
      case 'boolean':
        bytes += 4;
        break;
      case 'number':
        bytes += 8;
        break;
      case 'string':
        bytes += value.length * 2;
        break;
      case 'object':
        if (Array.isArray(value)) {
          bytes += 8; // Array overhead
          // Add array elements to stack
          for (let i = 0; i < value.length; i++) {
            stack.push(value[i]);
          }
        } else {
          bytes += 8; // Object overhead
          // Add object properties to stack
          for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              bytes += key.length * 2; // Key size
              stack.push(value[key]); // Value
            }
          }
        }
        break;
      default:
        bytes += 8;
    }
  }

  return bytes;
}

/**
 * Memory snapshot - captures memory state for comparison
 */
export interface MemorySnapshot {
  timestamp: number;
  jsHeapSizeLimitEstimate: number;
  usedJSHeapSizeEstimate: number;
  systemObjectSize?: number;
}

/**
 * Take a memory snapshot
 * @param systemObject Optional object to measure size of
 * @returns Memory snapshot
 */
export function takeMemorySnapshot(systemObject?: any): MemorySnapshot {
  let usedJSHeapSizeEstimate = 0;
  let jsHeapSizeLimitEstimate = 0;
  
  // Try to use performance.memory if available
  // Note: This is a non-standard feature and might not work in all browsers
  if ((performance as any).memory) {
    usedJSHeapSizeEstimate = (performance as any).memory.usedJSHeapSize || 0;
    jsHeapSizeLimitEstimate = (performance as any).memory.jsHeapSizeLimit || 0;
  }
  
  const snapshot: MemorySnapshot = {
    timestamp: Date.now(),
    usedJSHeapSizeEstimate,
    jsHeapSizeLimitEstimate
  };
  
  // If system object provided, estimate its size
  if (systemObject) {
    snapshot.systemObjectSize = estimateObjectSize(systemObject);
  }
  
  return snapshot;
}

/**
 * Compare two memory snapshots
 * @param before Snapshot before operation
 * @param after Snapshot after operation
 * @returns Comparison with differences
 */
export function compareSnapshots(before: MemorySnapshot, after: MemorySnapshot) {
  return {
    timeElapsed: after.timestamp - before.timestamp,
    heapDelta: after.usedJSHeapSizeEstimate - before.usedJSHeapSizeEstimate,
    systemObjectDelta: 
      (after.systemObjectSize || 0) - (before.systemObjectSize || 0),
    heapUsagePercentageBefore: 
      (before.usedJSHeapSizeEstimate / before.jsHeapSizeLimitEstimate) * 100 || 0,
    heapUsagePercentageAfter: 
      (after.usedJSHeapSizeEstimate / after.jsHeapSizeLimitEstimate) * 100 || 0
  };
}

/**
 * Format bytes to human-readable
 * @param bytes Size in bytes
 * @returns Human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Performance profile for a function
 * @param fn Function to profile
 * @param args Arguments for the function
 * @returns Object with performance metrics
 */
export function profileFunction<T extends (...args: any[]) => any>(
  fn: T, 
  ...args: Parameters<T>
): {
  result: ReturnType<T>;
  executionTime: number;
  memoryUsage: number;
} {
  // Memory before
  const beforeSnapshot = takeMemorySnapshot();
  const startTime = performance.now();
  
  // Execute function
  const result = fn(...args);
  
  // Memory after
  const endTime = performance.now();
  const afterSnapshot = takeMemorySnapshot();
  
  // Calculate metrics
  const diff = compareSnapshots(beforeSnapshot, afterSnapshot);
  
  return {
    result,
    executionTime: endTime - startTime,
    memoryUsage: diff.heapDelta
  };
}

/**
 * Record performance metrics over time
 */
export class PerformanceMetricsTracker {
  private metrics: {
    operation: string;
    timestamp: number;
    duration: number;
    memoryDelta?: number;
    objectSize?: number;
    success: boolean;
  }[] = [];
  
  /**
   * Record a performance metric
   * @param operation Operation name
   * @param duration Duration in milliseconds
   * @param success Whether operation was successful
   * @param memoryDelta Memory change in bytes (optional)
   * @param objectSize Size of resulting object (optional)
   */
  public recordMetric(
    operation: string,
    duration: number,
    success: boolean,
    memoryDelta?: number,
    objectSize?: number
  ): void {
    this.metrics.push({
      operation,
      timestamp: Date.now(),
      duration,
      memoryDelta,
      objectSize,
      success
    });
  }
  
  /**
   * Get all metrics
   */
  public getMetrics() {
    return [...this.metrics];
  }
  
  /**
   * Get metrics for a specific operation
   * @param operation Operation name
   */
  public getMetricsForOperation(operation: string) {
    return this.metrics.filter(m => m.operation === operation);
  }
  
  /**
   * Get average duration for an operation
   * @param operation Operation name
   */
  public getAverageDuration(operation: string): number {
    const metrics = this.getMetricsForOperation(operation);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }
  
  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }
}

// Create a global instance for use across tests
export const performanceTracker = new PerformanceMetricsTracker();


// Using browser's built-in Performance API instead of Node.js perf_hooks
// Browser-compatible performance API

export interface PerformanceTestResult {
  executionTime: number;
  memoryUsage?: {
    heapUsed: number;
    heapTotal: number;
  };
  operationsPerSecond: number;
  averageTimePerOperation: number;
}

export interface ParameterTestCase {
  name: string;
  routePattern: string;
  actualPath: string;
  expectedParams: Record<string, string> | null;
}

export const TEST_CASES = {
  simple: {
    name: 'Simple Path (1-2 parameters)',
    routePattern: '/user/:id/profile',
    actualPath: '/user/123/profile',
    expectedParams: { id: '123' }
  },
  medium: {
    name: 'Complex Path (5+ parameters)',
    routePattern: '/org/:orgId/team/:teamId/project/:projectId/task/:taskId/comment/:commentId',
    actualPath: '/org/org-1/team/team-2/project/proj-3/task/task-4/comment/comment-5',
    expectedParams: {
      orgId: 'org-1',
      teamId: 'team-2',
      projectId: 'proj-3',
      taskId: 'task-4',
      commentId: 'comment-5'
    }
  },
  complex: {
    name: 'Extremely Complex Path (10+ parameters)',
    routePattern: '/a/:p1/b/:p2/c/:p3/d/:p4/e/:p5/f/:p6/g/:p7/h/:p8/i/:p9/j/:p10',
    actualPath: '/a/1/b/2/c/3/d/4/e/5/f/6/g/7/h/8/i/9/j/10',
    expectedParams: {
      p1: '1', p2: '2', p3: '3', p4: '4', p5: '5',
      p6: '6', p7: '7', p8: '8', p9: '9', p10: '10'
    }
  }
};

export const runPerformanceTest = (
  testFn: () => void,
  iterations: number = 1000
): PerformanceTestResult => {
  // Use browser's built-in performance API
  const startTime = performance.now();
  
  // Browser doesn't provide direct memory measurements like Node.js
  // We'll estimate memory usage using performance.memory if available
  const startMemory = (performance as any).memory ? 
    { 
      heapUsed: (performance as any).memory.usedJSHeapSize || 0,
      heapTotal: (performance as any).memory.totalJSHeapSize || 0 
    } : undefined;

  for (let i = 0; i < iterations; i++) {
    testFn();
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  // Get end memory if available
  const endMemory = (performance as any).memory ? 
    { 
      heapUsed: (performance as any).memory.usedJSHeapSize || 0,
      heapTotal: (performance as any).memory.totalJSHeapSize || 0 
    } : undefined;

  const result: PerformanceTestResult = {
    executionTime: totalTime,
    operationsPerSecond: Math.round((iterations / totalTime) * 1000),
    averageTimePerOperation: totalTime / iterations
  };
  
  // Add memory usage if available (Chrome only)
  if (startMemory && endMemory) {
    result.memoryUsage = {
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal
    };
  }

  return result;
};

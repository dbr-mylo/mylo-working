
/**
 * System Health Monitoring
 * 
 * This module provides utilities to assess the overall system health
 * and detect degraded states that might require feature disabling.
 */

// Health check categories and their weights
const healthCategories = {
  network: 0.3,        // Network connectivity
  storage: 0.2,        // Local storage availability
  performance: 0.2,    // UI responsiveness
  errorRate: 0.2,      // Recent error frequency
  backend: 0.1         // Backend service availability
};

// Store health scores (0-100) for each category
const healthScores: Record<keyof typeof healthCategories, number> = {
  network: 100,
  storage: 100,
  performance: 100,
  errorRate: 100,
  backend: 100
};

// Tracking for recent errors (sliding window)
const recentErrors: Array<{
  timestamp: number;
  category: string;
}> = [];

/**
 * Get overall system health score (0-100)
 * Higher score = healthier system
 */
export function getSystemHealth(): number {
  let weightedScore = 0;
  
  // Calculate weighted score
  for (const [category, weight] of Object.entries(healthCategories)) {
    weightedScore += healthScores[category as keyof typeof healthCategories] * weight;
  }
  
  return Math.round(weightedScore);
}

/**
 * Update health score for a specific category
 * @param category Health category to update
 * @param score New score (0-100)
 */
export function updateHealthScore(
  category: keyof typeof healthCategories, 
  score: number
): void {
  // Ensure score is within valid range
  const validScore = Math.max(0, Math.min(100, score));
  healthScores[category] = validScore;
}

/**
 * Report a system error to be factored into health assessment
 * @param error The error that occurred
 * @param context The context where the error occurred
 */
export function reportSystemError(error: unknown, context: string): void {
  // Add to recent errors
  recentErrors.push({
    timestamp: Date.now(),
    category: context
  });
  
  // Remove errors older than 5 minutes
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  while (recentErrors.length > 0 && recentErrors[0].timestamp < fiveMinutesAgo) {
    recentErrors.shift();
  }
  
  // Calculate error rate score based on number of recent errors
  const errorRateScore = Math.max(0, 100 - (recentErrors.length * 5));
  updateHealthScore('errorRate', errorRateScore);
}

/**
 * Update network health based on connectivity and performance
 * @param isOnline Whether the system is online
 * @param pingMs Optional ping latency in milliseconds
 */
export function updateNetworkHealth(isOnline: boolean, pingMs?: number): void {
  let score = isOnline ? 100 : 0;
  
  // Factor in latency if available
  if (isOnline && pingMs !== undefined) {
    // Reduce score as latency increases
    // 0ms = 100, 1000ms = 0
    const latencyFactor = Math.max(0, 100 - (pingMs / 10));
    score = Math.min(score, latencyFactor);
  }
  
  updateHealthScore('network', score);
}

/**
 * Update storage health based on available space
 */
export function updateStorageHealth(): void {
  try {
    // Try to estimate available storage
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.quota && estimate.usage) {
          const availablePercentage = 100 * (1 - (estimate.usage / estimate.quota));
          // Score drops as available storage decreases
          const score = Math.max(0, Math.min(100, availablePercentage * 2)); // *2 because we want 50% free = 100 score
          updateHealthScore('storage', score);
        }
      });
    }
  } catch (e) {
    console.warn('Failed to check storage health:', e);
  }
}

/**
 * Update overall system health directly
 * @param adjustment Positive or negative adjustment to make
 */
export function updateSystemHealth(adjustment: number): void {
  // Apply adjustment across categories
  // For simplicity, we distribute the adjustment among all categories
  const perCategoryAdjustment = adjustment / Object.keys(healthCategories).length;
  
  for (const category of Object.keys(healthCategories) as Array<keyof typeof healthCategories>) {
    const newScore = Math.max(0, Math.min(100, healthScores[category] + perCategoryAdjustment));
    healthScores[category] = newScore;
  }
}

/**
 * Update performance health based on UI responsiveness
 */
export function updatePerformanceHealth(): void {
  try {
    // Check for long task observer support
    if ('PerformanceObserver' in window) {
      // Calculate score based on long tasks frequency and duration
      const longTaskScoreFactor = Math.max(0, 100 - (longTasksCount * 10) - (totalLongTaskTime / 50));
      updateHealthScore('performance', longTaskScoreFactor);
    }
  } catch (e) {
    console.warn('Failed to check performance health:', e);
  }
}

// Track long tasks for performance monitoring
let longTasksCount = 0;
let totalLongTaskTime = 0;

// Setup performance monitoring if available
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasksCount++;
        totalLongTaskTime += entry.duration;
        
        // Reset counts periodically to avoid penalizing forever
        setTimeout(() => {
          longTasksCount = Math.max(0, longTasksCount - 1);
          totalLongTaskTime = Math.max(0, totalLongTaskTime - entry.duration);
        }, 60000); // Reset after 1 minute
      }
      
      // Update performance score
      updatePerformanceHealth();
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.warn('Performance monitoring not supported:', e);
  }
}

/**
 * Check if system is in a degraded state
 * @returns boolean indicating if system is degraded
 */
export function isSystemDegraded(): boolean {
  return getSystemHealth() < 70; // Below 70% is considered degraded
}

/**
 * Get system health status text
 */
export function getSystemHealthStatus(): 'healthy' | 'degraded' | 'critical' {
  const health = getSystemHealth();
  if (health >= 70) return 'healthy';
  if (health >= 40) return 'degraded';
  return 'critical';
}

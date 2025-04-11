
/**
 * System Health Monitoring
 * 
 * Tracks application health metrics and provides a system health score
 * used by the feature flags system to gracefully degrade functionality
 * during system stress.
 */

// Health score ranges from 0-100 
// 100: Perfect health
// 0: Critical failure
let systemHealthScore = 100;

// Recent health checks
const healthChecks: { timestamp: number; score: number }[] = [];
const MAX_HEALTH_CHECKS = 20;

// Health aspect scores
interface HealthAspects {
  connectivity: number;  // 0-100
  performance: number;   // 0-100
  errors: number;        // 0-100
  resources: number;     // 0-100
  stability: number;     // 0-100
}

// Default to perfect health initially
const healthAspects: HealthAspects = {
  connectivity: 100,
  performance: 100,
  errors: 100,
  resources: 100,
  stability: 100
};

/**
 * Get the current system health score
 * @returns Number between 0-100 representing system health
 */
export function getSystemHealth(): number {
  return systemHealthScore;
}

/**
 * Get the current system health status label
 * @returns String representing health status: 'healthy', 'degraded', or 'critical'
 */
export function getSystemHealthStatus(): string {
  if (systemHealthScore >= 70) {
    return 'healthy';
  } else if (systemHealthScore >= 40) {
    return 'degraded';
  } else {
    return 'critical';
  }
}

/**
 * Update the system health score
 * @param delta Change to apply to health score (-100 to +100)
 */
export function updateSystemHealth(delta: number): void {
  // Record the previous score for change tracking
  const previousScore = systemHealthScore;
  
  // Apply delta, keeping within bounds
  systemHealthScore = Math.min(100, Math.max(0, systemHealthScore + delta));
  
  // Record the health check
  healthChecks.unshift({
    timestamp: Date.now(),
    score: systemHealthScore
  });
  
  // Keep only the most recent checks
  if (healthChecks.length > MAX_HEALTH_CHECKS) {
    healthChecks.length = MAX_HEALTH_CHECKS;
  }
  
  // Log significant changes
  if (Math.abs(previousScore - systemHealthScore) > 10) {
    console.info(
      `System health changed from ${previousScore} to ${systemHealthScore} (${delta > 0 ? '+' : ''}${delta})`
    );
    
    // Log warning if health is deteriorating significantly
    if (systemHealthScore < 50 && previousScore >= 50) {
      console.warn('System health degraded below 50% - activating reduced functionality mode');
    }
    // Log when health improves significantly
    else if (systemHealthScore >= 50 && previousScore < 50) {
      console.info('System health improved above 50% - restoring normal functionality');
    }
  }
}

/**
 * Report a system error to decrease health score
 * @param error Error that occurred
 * @param context Context where the error happened
 */
export function reportSystemError(error: Error, context: string): void {
  console.warn(`System error reported in ${context}:`, error);
  
  // Decrease health score based on error type and context
  let healthImpact = -5; // Default impact
  
  // Adjust impact based on error type
  if (error.name === 'NetworkError' || context.includes('network')) {
    healthImpact = -10;
    updateHealthAspect('connectivity', Math.max(0, healthAspects.connectivity - 15));
  } else if (context.includes('performance') || error.message.includes('timeout')) {
    healthImpact = -8;
    updateHealthAspect('performance', Math.max(0, healthAspects.performance - 12));
  } else if (context.includes('storage') || context.includes('database')) {
    healthImpact = -15;
    updateHealthAspect('resources', Math.max(0, healthAspects.resources - 20));
  }
  
  // Apply health impact
  updateSystemHealth(healthImpact);
}

/**
 * Update storage health aspect specifically
 * @param delta Change to apply to storage health score
 */
export function updateStorageHealth(delta: number): void {
  updateHealthAspect('resources', Math.max(0, Math.min(100, healthAspects.resources + delta)));
}

/**
 * Update a specific health aspect
 * @param aspect The health aspect to update
 * @param score New score for this aspect (0-100)
 */
export function updateHealthAspect(
  aspect: keyof HealthAspects, 
  score: number
): void {
  // Store the previous score
  const previousScore = healthAspects[aspect];
  
  // Update aspect score, keeping within bounds
  healthAspects[aspect] = Math.min(100, Math.max(0, score));
  
  // Calculate overall health as weighted average of all aspects
  recalculateOverallHealth();
  
  // Log significant changes
  if (Math.abs(previousScore - healthAspects[aspect]) > 20) {
    console.info(
      `Health aspect '${aspect}' changed from ${previousScore} to ${healthAspects[aspect]}`
    );
  }
}

/**
 * Recalculate the overall system health score based on all aspects
 */
function recalculateOverallHealth(): void {
  // Different weights could be applied to different aspects if needed
  const weights = {
    connectivity: 1.0,
    performance: 0.8,
    errors: 1.2,      // Errors weighted higher as they're more critical
    resources: 0.7,
    stability: 1.0
  };
  
  // Calculate weighted average
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const aspect of Object.keys(healthAspects) as Array<keyof HealthAspects>) {
    const weight = weights[aspect];
    totalWeight += weight;
    weightedSum += healthAspects[aspect] * weight;
  }
  
  // Update overall health score
  const newScore = weightedSum / totalWeight;
  updateSystemHealth(newScore - systemHealthScore); // Apply difference as delta
}

/**
 * Get health trends over time
 */
export function getHealthTrends(): { timestamp: number; score: number }[] {
  return [...healthChecks];
}

/**
 * Get detailed health aspect scores
 */
export function getHealthAspects(): HealthAspects {
  return { ...healthAspects };
}

/**
 * Reset system health to default values
 */
export function resetSystemHealth(): void {
  systemHealthScore = 100;
  
  Object.keys(healthAspects).forEach(key => {
    healthAspects[key as keyof HealthAspects] = 100;
  });
  
  healthChecks.length = 0;
  
  console.info('System health metrics have been reset to optimal values');
}

// Initialize with a health check
healthChecks.push({
  timestamp: Date.now(),
  score: systemHealthScore
});

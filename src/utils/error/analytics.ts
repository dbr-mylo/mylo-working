
/**
 * Error tracking for analytics
 */

// Define severity levels
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Track an error for analytics purposes
 * @param error The error object
 * @param context Context where the error occurred
 */
export function trackError(error: unknown, context: string): void {
  // Get error details
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Determine severity
  let severity: SeverityLevel = 'medium';
  
  // Adjust severity based on error type or content
  if (errorName === 'SyntaxError' || errorName === 'TypeError') {
    severity = 'high';
  } else if (errorName === 'ReferenceError' || errorName === 'RangeError') {
    severity = 'critical';
  } else if (
    errorMessage.includes('permission') || 
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('forbidden')
  ) {
    severity = 'high';
  }
  
  // Create analytics payload
  const analyticsPayload = {
    timestamp: new Date().toISOString(),
    errorName,
    errorMessage,
    context,
    severity,
    url: window.location.href,
    userAgent: navigator.userAgent,
    // Only include non-sensitive parts of the stack trace
    stackSummary: errorStack 
      ? errorStack
          .split('\n')
          .slice(0, 3)
          .join('\n')
      : undefined
  };
  
  // Log to console in development
  console.debug('[Error Analytics]', analyticsPayload);
  
  // In a production app, you would send this to your analytics service
  // Example: await analyticsService.trackEvent('error', analyticsPayload);
  
  // For now, we'll just simulate this with a console log
  console.info(`[Analytics] Error tracked: ${errorName} in ${context} (${severity})`);
}

/**
 * Track an error recovery attempt
 * @param error The original error
 * @param successful Whether the recovery was successful
 * @param method The recovery method used
 */
export function trackRecoveryAttempt(
  error: unknown, 
  successful: boolean, 
  method: string
): void {
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  
  // Create analytics payload for recovery attempt
  const recoveryPayload = {
    timestamp: new Date().toISOString(),
    errorName,
    method,
    successful,
    url: window.location.href
  };
  
  // Log to console in development
  console.debug('[Recovery Analytics]', recoveryPayload);
  
  // In production, send to analytics service
  console.info(
    `[Analytics] Recovery attempt ${successful ? 'succeeded' : 'failed'}: ${method} for ${errorName}`
  );
}

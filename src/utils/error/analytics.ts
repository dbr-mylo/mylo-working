
/**
 * Tracks errors for analytics purposes
 * @param error The error that occurred
 * @param context The context where the error occurred
 */
export const trackError = (error: unknown, context: string): void => {
  // This would be connected to an actual analytics service in production
  console.info(`[Analytics] Error tracked in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  
  // Sample analytics data structure
  const analyticsData = {
    timestamp: new Date().toISOString(),
    context,
    errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
  
  // Log analytics data for now - would send to a service in production
  console.info('[Analytics] Error data:', analyticsData);
};

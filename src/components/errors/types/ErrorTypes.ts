
/**
 * Analytics data for error boundary incidents
 */
export interface ErrorBoundaryAnalytics {
  /** Component name where the error occurred */
  componentName: string;
  /** Error message */
  errorMessage: string;
  /** Type of error (e.g., TypeError, SyntaxError) */
  errorType: string;
  /** Timestamp when the error occurred */
  timestamp: string;
  /** How many errors have occurred in this component */
  errorCount: number;
  /** Time since the last error in milliseconds */
  timeSinceLastError?: number;
  /** Number of recovery attempts made */
  recoveryAttempts: number;
  /** Whether the component recovered from the error */
  wasRecovered: boolean;
}

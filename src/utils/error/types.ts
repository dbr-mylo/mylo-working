
/**
 * Error context containing metadata about the error
 */
export interface ErrorContext {
  /** Component or function where the error occurred */
  source: string;
  /** User-friendly message to display */
  userMessage?: string;
  /** Technical error message for logs */
  techMessage?: string;
  /** Timestamp when the error occurred */
  timestamp?: number;
  /** Unique ID for the error instance */
  errorId?: string;
  /** Any additional context information */
  meta?: Record<string, any>;
}

/**
 * Error severity levels for categorizing errors
 */
export enum SeverityLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error handler interface
 */
export interface ErrorHandler {
  (error: unknown, context: string, userMessage?: string): void;
}

/**
 * Error tracker interface for analytics
 */
export interface ErrorTracker {
  (error: unknown, context: ErrorContext, severity?: SeverityLevel): void;
}

/**
 * Configuration for retry mechanism
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Delay between retries in milliseconds */
  delayMs?: number;
  /** Function to determine if an error should trigger a retry */
  retryCondition?: (error: unknown) => boolean;
}

/**
 * Default configuration for retry mechanism
 */
export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  delayMs: 300,
  retryCondition: () => true,
};

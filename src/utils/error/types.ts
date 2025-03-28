
/**
 * Error handling types
 */

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Base delay between retries in milliseconds */
  baseDelay: number;
  /** Whether to use exponential backoff for retries */
  useExponentialBackoff?: boolean;
  /** Optional callback to run before each retry */
  onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * Configuration for circuit breaker pattern
 */
export interface CircuitBreakerConfig {
  /** Failure threshold to trip the circuit */
  failureThreshold: number;
  /** Reset timeout in milliseconds */
  resetTimeout: number;
  /** Optional callback when circuit trips */
  onCircuitOpen?: () => void;
  /** Optional callback when circuit resets */
  onCircuitClose?: () => void;
}

/**
 * Resolution step for guided error resolution
 */
export interface ResolutionStep {
  /** Step instruction text */
  text: string;
  /** Optional action to perform */
  action?: () => void;
}

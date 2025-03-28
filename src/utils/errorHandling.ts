import { toast } from "sonner";
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Error handling utility functions
 */

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Starting delay in milliseconds */
  baseDelay?: number;
  /** Whether to use exponential backoff strategy */
  useExponentialBackoff?: boolean;
  /** Optional callback to determine if an error is retryable */
  isRetryable?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  useExponentialBackoff: true,
  isRetryable: () => true,
};

/**
 * Handles an error with consistent logging and user notification
 * @param error The error to handle
 * @param context Context information about where the error occurred
 * @param userMessage Optional custom message to show to the user
 * @param shouldToast Whether to show a toast notification (default: true)
 */
export const handleError = (
  error: unknown,
  context: string,
  userMessage?: string,
  shouldToast: boolean = true
): void => {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : 'An unknown error occurred';
  
  // Log error with context
  console.error(`Error in ${context}:`, error);
  
  // Add analytics tracking for errors
  trackError(error, context);
  
  // Show toast notification if requested
  if (shouldToast) {
    toast.error(userMessage || errorMessage, {
      description: "See console for more details",
      duration: 5000,
    });
  }
};

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

/**
 * Wraps an async function with retry logic
 * @param fn The async function to wrap
 * @param config Retry configuration
 * @returns A new function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  config: RetryConfig = {}
): Promise<T> {
  const { maxAttempts, baseDelay, useExponentialBackoff, isRetryable } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  };
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxAttempts!; attempt++) {
    try {
      // Track attempt for analytics
      if (attempt > 0) {
        console.info(`[Analytics] Retry attempt ${attempt} for operation`);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!isRetryable!(error)) {
        console.info(`[Analytics] Error not retryable, stopping retry attempts`);
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxAttempts! - 1) {
        console.info(`[Analytics] Max retry attempts (${maxAttempts}) reached`);
        throw error;
      }
      
      // Calculate delay using exponential backoff if configured
      const delay = useExponentialBackoff! 
        ? baseDelay! * Math.pow(2, attempt)
        : baseDelay!;
        
      console.info(`[Analytics] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This point should not be reached due to the throw in the loop,
  // but TypeScript requires a return value
  throw lastError;
}

/**
 * Wraps an async function with error handling and retry logic
 * @param fn The async function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @param retryConfig Optional retry configuration
 * @returns A new function that handles errors and retries
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string,
  userMessage?: string,
  retryConfig?: RetryConfig
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args) => {
    try {
      // Apply retry logic if configuration is provided
      if (retryConfig) {
        return await withRetry(() => fn(...args), retryConfig);
      }
      // Otherwise, just run the function
      return await fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}

/**
 * Wraps a synchronous function with error handling
 * @param fn The function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @returns A new function that handles errors
 */
export function withSyncErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => T,
  context: string,
  userMessage?: string
): (...args: Args) => T | undefined {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}

/**
 * Creates a role-specific error message
 * @param error The error to handle
 * @param role The user's role
 * @param context Context information about where the error occurred
 * @returns An error message tailored to the user's role
 */
export function getRoleSpecificErrorMessage(
  error: unknown,
  role: string | null | undefined,
  context: string
): string {
  const baseMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  switch (role) {
    case 'designer':
      return `Design error in ${context}: ${baseMessage}. You may need to check your style configurations.`;
    case 'writer':
      return `Content error in ${context}: ${baseMessage}. Your content is still safe.`;
    case 'admin':
      return `System error in ${context}: ${baseMessage}. Technical details have been logged.`;
    default:
      return `Error in ${context}: ${baseMessage}`;
  }
}

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  failures: number;
  lastFailure: number | null;
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** Failure threshold before opening the circuit */
  failureThreshold?: number;
  /** Time in milliseconds before trying to half-open the circuit */
  resetTimeout?: number;
  /** Maximum number of calls in half-open state */
  halfOpenCalls?: number;
}

const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenCalls: 1,
};

/**
 * Circuit breaker pattern implementation
 * Prevents calling a service that is likely to fail
 */
export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: Required<CircuitBreakerConfig>;
  private halfOpenCallsCount: number = 0;
  
  /**
   * Create a new circuit breaker
   * @param config Circuit breaker configuration
   */
  constructor(config: CircuitBreakerConfig = {}) {
    this.config = {
      ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
      ...config
    } as Required<CircuitBreakerConfig>;
    
    this.state = {
      failures: 0,
      lastFailure: null,
      status: 'CLOSED'
    };
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param fn The function to execute
   * @returns The result of the function
   * @throws Error if the circuit is open or the function fails
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state.status === 'OPEN') {
      // Check if it's time to try again
      if (this.state.lastFailure && 
          Date.now() - this.state.lastFailure >= this.config.resetTimeout) {
        this.halfOpen();
      } else {
        console.info('[Analytics] Circuit breaker is OPEN, request rejected');
        throw new Error('Service unavailable (circuit breaker open)');
      }
    }
    
    if (this.state.status === 'HALF_OPEN' && 
        this.halfOpenCallsCount >= this.config.halfOpenCalls) {
      console.info('[Analytics] Too many calls in HALF_OPEN state, request rejected');
      throw new Error('Service unavailable (circuit breaker half-open limit reached)');
    }
    
    if (this.state.status === 'HALF_OPEN') {
      this.halfOpenCallsCount++;
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state.status === 'HALF_OPEN') {
      console.info('[Analytics] Circuit breaker reset (success in HALF_OPEN state)');
      this.close();
    }
    
    // Reset failure count in closed state
    if (this.state.status === 'CLOSED') {
      this.state.failures = 0;
    }
  }
  
  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.state.failures++;
    this.state.lastFailure = Date.now();
    
    console.info(`[Analytics] Circuit breaker failure count: ${this.state.failures}/${this.config.failureThreshold}`);
    
    if (this.state.status === 'HALF_OPEN' || 
        (this.state.status === 'CLOSED' && this.state.failures >= this.config.failureThreshold)) {
      this.open();
    }
  }
  
  /**
   * Open the circuit breaker
   */
  private open(): void {
    console.info('[Analytics] Circuit breaker OPENED');
    this.state.status = 'OPEN';
  }
  
  /**
   * Half-open the circuit breaker
   */
  private halfOpen(): void {
    console.info('[Analytics] Circuit breaker HALF-OPEN');
    this.state.status = 'HALF_OPEN';
    this.halfOpenCallsCount = 0;
  }
  
  /**
   * Close the circuit breaker
   */
  private close(): void {
    console.info('[Analytics] Circuit breaker CLOSED');
    this.state.status = 'CLOSED';
    this.state.failures = 0;
    this.halfOpenCallsCount = 0;
  }
  
  /**
   * Get the current status of the circuit breaker
   */
  getStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state.status;
  }
}

/**
 * A hook to handle errors with role-specific messaging
 */
export function useRoleAwareErrorHandling() {
  const { role } = useAuth();
  
  const handleRoleAwareError = React.useCallback((
    error: unknown,
    context: string,
    userMessage?: string
  ) => {
    const roleMessage = getRoleSpecificErrorMessage(error, role, context);
    handleError(error, context, userMessage || roleMessage);
  }, [role]);
  
  return { handleRoleAwareError };
}

/**
 * Create a guided error resolution component
 * @param error The error to resolve
 * @param resolutionSteps Steps to resolve the error
 */
export function createGuidedResolution(
  error: unknown, 
  resolutionSteps: string[]
): React.ReactNode {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-sm font-medium text-blue-800">How to resolve this issue:</h3>
      <ol className="mt-2 pl-5 list-decimal text-sm text-blue-700 space-y-1">
        {resolutionSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Get resolution steps for common errors
 * @param error The error to get resolution steps for
 * @param context The context where the error occurred
 */
export function getErrorResolutionSteps(
  error: unknown, 
  context: string
): string[] {
  // Default steps for generic errors
  let steps = [
    "Refresh the page and try again.",
    "Check your internet connection.",
    "Clear your browser cache.",
    "If the problem persists, contact support."
  ];
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Customize steps based on error type and context
  if (errorMessage.includes("permission") || errorMessage.includes("access")) {
    steps = [
      "Verify you have the correct permissions.",
      "Try logging out and logging back in.",
      "Contact an administrator if you need access."
    ];
  } else if (errorMessage.includes("timeout") || errorMessage.includes("network")) {
    steps = [
      "Check your internet connection.",
      "Try again in a few moments.",
      "If using a VPN, try disabling it temporarily."
    ];
  } else if (context.includes("auth") || context.includes("login")) {
    steps = [
      "Verify your credentials are correct.",
      "Reset your password if you're having trouble.",
      "Check if your account is locked or disabled."
    ];
  } else if (context.includes("document") || context.includes("save")) {
    steps = [
      "Check if you have unsaved changes.",
      "Try saving with a different name.",
      "Ensure you have sufficient permissions for this document."
    ];
  }
  
  return steps;
}

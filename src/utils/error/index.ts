
// Re-export error handling utilities with explicit naming to avoid conflicts
export { trackError } from './analytics';
export { 
  CircuitBreaker,
  createCircuitBreaker,
  // Export with a renamed type to avoid conflict
  type CircuitBreakerConfig as CircuitBreakerOptions
} from './circuitBreaker';
export { getErrorResolutionSteps } from './errorResolution';
export { handleError } from './handleError';
export { getRoleSpecificErrorMessage } from './roleSpecificErrors';
export { 
  type ErrorContext,
  type ErrorHandler,
  type ErrorTracker,
  type SeverityLevel
} from './types';
export { 
  withErrorHandling,
  withSyncErrorHandling
} from './withErrorHandling';
export { 
  withRetry,
  // Export with a renamed type to avoid conflict 
  type RetryConfig as RetryOptions
} from './withRetry';

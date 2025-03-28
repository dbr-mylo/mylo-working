
// Re-export error handling utilities with explicit naming to avoid conflicts
export { trackError } from './analytics';
export { 
  CircuitBreaker,
  createCircuitBreaker,
  type CircuitBreakerConfig 
} from './circuitBreaker';
export { getErrorResolutionSteps } from './errorResolution';
export { handleError } from './handleError';
export { getRoleSpecificErrorMessage } from './roleSpecificErrors';
export { 
  type ErrorContext,
  type ErrorHandler,
  type ErrorTracker,
  type SeverityLevel,
  type RetryConfig,
  type ResolutionStep
} from './types';
export { 
  withErrorHandling,
  withSyncErrorHandling
} from './withErrorHandling';
export { withRetry } from './withRetry';

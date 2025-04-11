
// Export the core ErrorBoundary component and analytics function
export { ErrorBoundary, getErrorBoundaryAnalytics } from './core/ErrorBoundary';

// Export role-aware error components and hooks
export {
  RoleAwareErrorMessage,
  RoleAwareErrorFallback,
  useRoleAwareErrorBoundary
} from './RoleAwareErrorComponents';

// Export context-aware error boundary
export {
  ContextAwareErrorBoundary,
  withContextAwareErrorBoundary
} from './ContextAwareErrorBoundary';

// Export state restoration utilities
export {
  StateRestoreProvider,
  StateRestoreContext,
  useStateRestore
} from './StateRestoreProvider';

// Export enhanced error boundary
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';

// Export application-level error boundary
export { ApplicationErrorBoundary } from './ApplicationErrorBoundary';

// Export standard error boundary HOC
export { WithErrorBoundary, withErrorBoundary } from './WithErrorBoundary';

// Export types
export type { ErrorBoundaryAnalytics } from './types/ErrorTypes';

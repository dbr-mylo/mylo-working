
// Export the core ErrorBoundary component and analytics function
export { ErrorBoundary, getErrorBoundaryAnalytics } from './core/ErrorBoundary';

// Export role-aware error components and hooks
export {
  RoleAwareErrorMessage,
  RoleAwareErrorFallback,
  useRoleAwareErrorBoundary
} from './RoleAwareErrorComponents';

// Export state restoration utilities
export {
  StateRestoreProvider,
  StateRestoreContext,
  useStateRestore
} from './StateRestoreProvider';

// Export types
export type { ErrorBoundaryAnalytics } from './types/ErrorTypes';

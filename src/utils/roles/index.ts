
/**
 * Role-Based Utilities Index
 * 
 * This file exports all role-related utilities, hooks, and components
 * to provide a centralized import point.
 */

// Core role hooks
export * from './RoleHooks';
export * from './RoleFunctions';

// Role-specific components
export * from './RoleComponents';
// Explicitly re-export EditorOnly from its dedicated file to avoid ambiguity with RoleComponents export
export { EditorOnly } from './EditorOnly';

// Role utilities
export * from './types';
export * from './middleware';
export * from './auditLogger';
export * from './persistence';

// Export hooks by category
export * from './hooks/useCacheClearing';

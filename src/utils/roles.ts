
/**
 * Re-exports from the role-specific modules
 * 
 * This is a convenience file that re-exports the commonly used
 * hooks and components from the roles directory.
 * It serves as a backward compatibility layer for existing code.
 */

// Re-export everything from the roles module
export * from './roles/index';

// Specific hook exports for better discoverability
export { 
  useIsAdmin, 
  useIsDesigner, 
  useIsEditor, 
  useIsDesignerOrAdmin,
  useRoleFeatures 
} from './roles/RoleHooks';
export { EditorOnly } from './roles/EditorOnly';
export { useCacheClearing } from './roles/hooks/useCacheClearing';

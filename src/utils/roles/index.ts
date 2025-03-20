
// Export all role-based hooks and components
export * from './RoleHooks';
export * from './RoleComponents';
export * from './RoleFunctions';
export * from './middleware';
export * from './auditLogger';
export * from './types';
export * from './persistence';

// Re-export EditorOnly explicitly to resolve the ambiguity
export { EditorOnly } from './EditorOnly';

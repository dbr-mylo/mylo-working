
/**
 * Role-Specific Hooks
 * 
 * These hooks provide easy ways to check the user's role or get role-specific values.
 * They now use the centralized role functions to ensure consistency.
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import {
  isDesignerRole,
  isWriterRole,
  isAdminRole,
  isDesignerOrAdminRole,
  isWriterOrAdminRole,
  getRoleSpecificValue,
  hasAnyRole
} from './RoleFunctions';

/**
 * Hook to get role-specific value
 */
export function useRoleSpecificValue<T>(designerValue: T, writerValue: T, adminValue: T = designerValue): T {
  const { role } = useAuth();
  return getRoleSpecificValue(role, designerValue, writerValue, adminValue);
}

/**
 * Hook to check if current user has designer role
 */
export function useIsDesigner(): boolean {
  const { role } = useAuth();
  return isDesignerRole(role);
}

/**
 * Hook to check if current user has writer role (includes legacy 'editor' role)
 */
export function useIsWriter(): boolean {
  const { role } = useAuth();
  // Fix: Make sure we properly check for both writer, editor, and admin roles
  return isWriterRole(role) || isAdminRole(role);
}

/**
 * Hook to check if current user has admin role
 */
export function useIsAdmin(): boolean {
  const { role } = useAuth();
  return isAdminRole(role);
}

/**
 * Hook to check if user has one of multiple roles
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const { role } = useAuth();
  return hasAnyRole(role, roles);
}

/**
 * Hook to check if user has designer or admin role
 */
export function useIsDesignerOrAdmin(): boolean {
  const { role } = useAuth();
  return isDesignerOrAdminRole(role);
}

/**
 * Hook to check if user has writer or admin role
 */
export function useIsWriterOrAdmin(): boolean {
  const { role } = useAuth();
  return isWriterOrAdminRole(role);
}

/**
 * Hook to check if user can manage templates
 */
export function useCanManageTemplates(): boolean {
  return useHasAnyRole(['designer', 'admin']);
}

/**
 * Hook to check if user can publish templates
 */
export function useCanPublishTemplates(): boolean {
  return useHasAnyRole(['designer', 'admin']);
}

/**
 * Hook to check if user can use templates
 */
export function useCanUseTemplates(): boolean {
  return useHasAnyRole(['writer', 'designer', 'admin']);
}

// Maintain backward compatibility with old hook names
/**
 * @deprecated Use useIsWriter instead
 */
export function useIsEditor(): boolean {
  return useIsWriter();
}

/**
 * @deprecated Use useIsWriterOrAdmin instead
 */
export function useIsEditorOrAdmin(): boolean {
  return useIsWriterOrAdmin();
}

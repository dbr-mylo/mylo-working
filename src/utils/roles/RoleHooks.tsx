
/**
 * Role-Specific Hooks
 * 
 * These hooks provide easy ways to check the user's role or get role-specific values.
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

/**
 * Hook to get role-specific value
 */
export function useRoleSpecificValue<T>(designerValue: T, editorValue: T, adminValue: T = designerValue): T {
  const { role } = useAuth();
  
  if (role === 'designer') {
    return designerValue;
  } else if (role === 'editor') {
    return editorValue;
  } else if (role === 'admin') {
    return adminValue;
  }
  
  return editorValue;
}

/**
 * Hook to check if current user has designer role
 */
export function useIsDesigner(): boolean {
  const { role } = useAuth();
  return role === 'designer';
}

/**
 * Hook to check if current user has editor role
 */
export function useIsEditor(): boolean {
  const { role } = useAuth();
  return role === 'editor';
}

/**
 * Hook to check if current user has admin role
 */
export function useIsAdmin(): boolean {
  const { role } = useAuth();
  return role === 'admin';
}

/**
 * Hook to check if user has one of multiple roles
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const { role } = useAuth();
  return role ? roles.includes(role) : false;
}

/**
 * Hook to check if user has designer or admin role
 */
export function useIsDesignerOrAdmin(): boolean {
  return useHasAnyRole(['designer', 'admin']);
}

/**
 * Hook to check if user has editor or admin role
 */
export function useIsEditorOrAdmin(): boolean {
  return useHasAnyRole(['editor', 'admin']);
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
  return useHasAnyRole(['editor', 'designer', 'admin']);
}

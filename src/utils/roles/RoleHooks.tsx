
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { useCacheClearing } from './hooks/useCacheClearing';
import { useCacheClearer } from './hooks/useCacheClearer';

/**
 * Check if the current user has the designer role
 */
export const useIsDesigner = () => {
  const { role } = useAuth();
  return role === 'designer';
};

/**
 * Check if the current user has the editor role
 */
export const useIsEditor = () => {
  const { role } = useAuth();
  return role === 'editor';
};

/**
 * Get the current user's role
 */
export const useUserRole = () => {
  const { role } = useAuth();
  return role;
};

/**
 * Check if the current user has a specific role
 */
export const useHasRole = (requiredRole: UserRole) => {
  const { role } = useAuth();
  return role === requiredRole;
};

/**
 * Check if the current user is authenticated
 */
export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

/**
 * Legacy support for cache clearing functionality
 * @deprecated Use useCacheClearer instead
 */
export { useCacheClearing };

/**
 * Export new cache clearer hook
 */
export { useCacheClearer };

/**
 * Get permissions based on the current user's role
 */
export const useRolePermissions = () => {
  const isDesigner = useIsDesigner();
  const isEditor = useIsEditor();
  
  return {
    canEditContent: isDesigner || isEditor,
    canManageStyles: isDesigner,
    canManageTemplates: isDesigner,
    canPublish: isDesigner || isEditor,
    canClearCache: isDesigner,
    canManageSystem: isDesigner
  };
};


/**
 * Role-Specific Hooks
 * 
 * Collection of hooks for determining the current user's role
 * and associated permissions.
 */

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

/**
 * Check if current user is an admin
 */
export const useIsAdmin = (): boolean => {
  const { role } = useAuth();
  return role === 'admin';
};

/**
 * Check if current user is a designer
 */
export const useIsDesigner = (): boolean => {
  const { role } = useAuth();
  return role === 'designer';
};

/**
 * Check if current user is an editor
 */
export const useIsEditor = (): boolean => {
  const { role } = useAuth();
  return role === 'editor';
};

/**
 * Check if current user is a designer or admin
 */
export const useIsDesignerOrAdmin = (): boolean => {
  const { role } = useAuth();
  return role === 'designer' || role === 'admin';
};

/**
 * Get role-specific features
 */
export const useRoleFeatures = () => {
  const { role } = useAuth();
  
  return {
    canEditStyles: role === 'designer' || role === 'admin',
    canCreateTemplates: role === 'designer' || role === 'admin',
    canEditContent: role === 'editor' || role === 'designer' || role === 'admin',
    canManageUsers: role === 'admin'
  };
};

/**
 * Check if current user has one of the given roles
 */
export const useHasRole = (roles: UserRole[]): boolean => {
  const { role } = useAuth();
  return role ? roles.includes(role) : false;
};

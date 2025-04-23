/**
 * Role-Specific Utility Functions
 * 
 * These functions implement cumulative role inheritance where:
 * Writer ⊂ Designer ⊂ Admin (Writer is subset of Designer is subset of Admin)
 */

import { UserRole } from '@/lib/types';

/**
 * Check if a role has writer access (includes designer and admin roles)
 */
export const isWriterRole = (role: UserRole | null): boolean => {
  // All roles equal or higher than writer have writer access
  return role === 'writer' || role === 'editor' || isDesignerRole(role);
};

/**
 * Check if a role has designer access (includes admin role)
 */
export const isDesignerRole = (role: UserRole | null): boolean => {
  // Designer and admin roles have designer access
  return role === 'designer' || isAdminRole(role);
};

/**
 * Check if a role is an admin role
 */
export const isAdminRole = (role: UserRole | null): boolean => {
  return role === 'admin';
};

/**
 * Check if a role has designer or admin access
 * @deprecated Use isDesignerRole instead as it now includes admin role
 */
export const isDesignerOrAdminRole = (role: UserRole | null): boolean => {
  return isDesignerRole(role);
};

/**
 * Check if a role has writer or admin access
 * @deprecated Use isWriterRole instead as it now includes admin role
 */
export const isWriterOrAdminRole = (role: UserRole | null): boolean => {
  return isWriterRole(role);
};

/**
 * Get a role-specific value based on the user's role
 * 
 * Allows providing specific values for each role and handles null roles gracefully
 */
export const getRoleSpecificValue = <T,>(
  role: UserRole | null,
  designerValue: T,
  writerValue: T,
  adminValue: T = designerValue
): T => {
  if (isAdminRole(role)) {
    return adminValue;
  } else if (isDesignerRole(role)) {
    return designerValue;
  } else if (isWriterRole(role)) {
    return writerValue;
  }
  
  // Default to writer value if role is undefined
  console.warn('No role defined, defaulting to writer role behavior');
  return writerValue;
};

/**
 * Check if a role has any of the specified roles
 * 
 * Handles the special case of 'editor' role being treated as 'writer'
 */
export const hasAnyRole = (role: UserRole | null, roles: UserRole[]): boolean => {
  if (!role) return false;
  
  // Special case for 'editor' role - map it to 'writer' for compatibility
  if (role === 'editor' && roles.includes('writer')) {
    return true;
  }
  
  return roles.includes(role);
};

/**
 * @deprecated Use isWriterRole instead
 */
export const isEditorRole = (role: UserRole | null): boolean => {
  return isWriterRole(role);
};

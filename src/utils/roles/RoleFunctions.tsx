
/**
 * Role-Specific Utility Functions
 * 
 * These functions provide a centralized way to check roles and get role-specific values
 * without needing to directly access the auth context.
 */

import { UserRole } from '@/lib/types';

/**
 * Check if a role is a designer role
 */
export const isDesignerRole = (role: UserRole | null): boolean => {
  return role === 'designer';
};

/**
 * Check if a role is a writer role (includes legacy 'editor' role)
 */
export const isWriterRole = (role: UserRole | null): boolean => {
  // Fix: Make sure both 'writer' and 'editor' are considered writer roles
  return role === 'writer' || role === 'editor';
};

/**
 * Check if a role is an admin role
 */
export const isAdminRole = (role: UserRole | null): boolean => {
  return role === 'admin';
};

/**
 * Check if a role is either designer or admin
 */
export const isDesignerOrAdminRole = (role: UserRole | null): boolean => {
  return isDesignerRole(role) || isAdminRole(role);
};

/**
 * Check if a role is either writer or admin
 */
export const isWriterOrAdminRole = (role: UserRole | null): boolean => {
  return isWriterRole(role) || isAdminRole(role);
};

/**
 * Get a role-specific value
 */
export const getRoleSpecificValue = <T,>(
  role: UserRole | null,
  designerValue: T,
  writerValue: T,
  adminValue: T = designerValue
): T => {
  if (isDesignerRole(role)) {
    return designerValue;
  } else if (isWriterRole(role)) {
    return writerValue;
  } else if (isAdminRole(role)) {
    return adminValue;
  }
  
  // Default to writer value if role is undefined
  return writerValue;
};

/**
 * Check if a role has any of the specified roles
 */
export const hasAnyRole = (role: UserRole | null, roles: UserRole[]): boolean => {
  if (!role) return false;
  
  // Special case for 'editor' role - map it to 'writer' for compatibility
  if (role === 'editor' && roles.includes('writer')) {
    return true;
  }
  
  return roles.includes(role);
};

// For backward compatibility
/**
 * @deprecated Use isWriterRole instead
 */
export const isEditorRole = (role: UserRole | null): boolean => {
  return isWriterRole(role);
};

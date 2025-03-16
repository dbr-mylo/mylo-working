
/**
 * Role-Specific Functions
 * 
 * These are utility functions for role-based rendering and logic.
 */

import { UserRole } from '@/lib/types';

/**
 * Role-specific conditional rendering function
 */
export function renderForRole<T>(
  role: UserRole | null,
  options: {
    designer: T;
    editor: T;
    admin: T;
    default?: T;
  }
): T {
  if (role === 'designer') {
    return options.designer;
  } else if (role === 'editor') {
    return options.editor;
  } else if (role === 'admin') {
    return options.admin;
  }
  
  return options.default || options.editor;
}

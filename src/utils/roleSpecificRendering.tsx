
/**
 * Role-Specific Rendering Utilities
 * 
 * This utility provides components and functions to help separate
 * designer and editor role-specific code paths.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

/**
 * Component that only renders its children for a specific role
 */
export const RoleOnly: React.FC<{
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ role, children, fallback = null }) => {
  const { role: userRole } = useAuth();
  
  if (userRole === role) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Designer-specific component
 */
export const DesignerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <RoleOnly role="designer" children={children} fallback={fallback} />;
};

/**
 * Editor-specific component
 */
export const EditorOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <RoleOnly role="editor" children={children} fallback={fallback} />;
};

/**
 * Hook to get role-specific value
 */
export function useRoleSpecificValue<T>(designerValue: T, editorValue: T, defaultValue?: T): T {
  const { role } = useAuth();
  
  if (role === 'designer') {
    return designerValue;
  } else if (role === 'editor') {
    return editorValue;
  }
  
  return defaultValue || editorValue;
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
 * Role-specific conditional rendering function
 */
export function renderForRole<T>(
  role: UserRole | null,
  options: {
    designer: T;
    editor: T;
    default?: T;
  }
): T {
  if (role === 'designer') {
    return options.designer;
  } else if (role === 'editor') {
    return options.editor;
  }
  
  return options.default || options.editor;
}

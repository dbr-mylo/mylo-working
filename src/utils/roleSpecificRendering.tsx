
/**
 * Role-Specific Rendering Utilities
 * 
 * This utility provides components and functions to help separate
 * designer, editor, and admin role-specific code paths.
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
 * Admin-specific component
 */
export const AdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <RoleOnly role="admin" children={children} fallback={fallback} />;
};

/**
 * Component that renders for multiple roles
 */
export const MultiRoleOnly: React.FC<{
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ roles, children, fallback = null }) => {
  const { role: userRole } = useAuth();
  
  if (userRole && roles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Designer or Admin only component
 */
export const DesignerOrAdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['designer', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Editor or Admin only component
 */
export const EditorOrAdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['editor', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Component that renders for all except specified roles
 */
export const ExcludeRoles: React.FC<{
  excludeRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ excludeRoles, children, fallback = null }) => {
  const { role: userRole } = useAuth();
  
  if (userRole && !excludeRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Component that renders only for users who can create content
 */
export const ContentCreatorOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['editor', 'designer', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Component that renders only for users who can manage templates
 */
export const TemplateManagerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['designer', 'admin']} children={children} fallback={fallback} />;
};

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

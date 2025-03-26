
/**
 * Role-Specific Component Rendering
 * 
 * These components render content conditionally based on the user's role.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { RoleComponentProps, MultiRoleComponentProps, ExcludeRolesProps } from './types';

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
export const DesignerOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <RoleOnly role="designer" children={children} fallback={fallback} />;
};

/**
 * Writer-specific component
 */
export const WriterOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <RoleOnly role="writer" children={children} fallback={fallback} />;
};

/**
 * Admin-specific component
 */
export const AdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <RoleOnly role="admin" children={children} fallback={fallback} />;
};

/**
 * Component that renders for multiple roles
 */
export const MultiRoleOnly: React.FC<MultiRoleComponentProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const { role: userRole } = useAuth();
  
  if (userRole && roles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Designer or Admin only component
 */
export const DesignerOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['designer', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Writer or Admin only component
 */
export const WriterOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['writer', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Component that renders for all except specified roles
 */
export const ExcludeRoles: React.FC<ExcludeRolesProps> = ({ 
  excludeRoles, 
  children, 
  fallback = null 
}) => {
  const { role: userRole } = useAuth();
  
  if (userRole && !excludeRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Component that renders only for users who can create content
 */
export const ContentCreatorOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['writer', 'designer', 'admin']} children={children} fallback={fallback} />;
};

/**
 * Component that renders only for users who can manage templates
 */
export const TemplateManagerOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <MultiRoleOnly roles={['designer', 'admin']} children={children} fallback={fallback} />;
};

// For backward compatibility
/**
 * @deprecated Use WriterOnly instead
 */
export const EditorOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <WriterOnly children={children} fallback={fallback} />;
};

/**
 * @deprecated Use WriterOrAdminOnly instead
 */
export const EditorOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  return <WriterOrAdminOnly children={children} fallback={fallback} />;
};

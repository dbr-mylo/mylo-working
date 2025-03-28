
/**
 * Role-Specific Component Rendering
 * 
 * These components render content conditionally based on the user's role.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { RoleComponentProps, MultiRoleComponentProps, ExcludeRolesProps } from './types';
import { isWriterRole, isDesignerRole, isAdminRole, hasAnyRole } from './RoleFunctions';

/**
 * Component that only renders its children for a specific role
 */
export const RoleOnly: React.FC<{
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ role, children, fallback = null }) => {
  const { role: userRole } = useAuth();
  
  // Writer role special case - check using the centralized function
  if (role === 'writer' && isWriterRole(userRole)) {
    return <>{children}</>;
  }
  
  // Designer role special case - also accessible by admin
  if (role === 'designer' && (isDesignerRole(userRole) || isAdminRole(userRole))) {
    return <>{children}</>;
  }
  
  // Admin role
  if (role === 'admin' && isAdminRole(userRole)) {
    return <>{children}</>;
  }
  
  // Direct comparison for any other roles
  if (userRole === role) {
    return <>{children}</>;
  }
  
  // If no match, render fallback
  return <>{fallback}</>;
};

/**
 * Designer-specific component
 */
export const DesignerOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  const { role } = useAuth();
  const allowed = isDesignerRole(role) || isAdminRole(role); 
  
  if (!allowed) {
    console.log("DesignerOnly content hidden: User does not have designer role");
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Writer-specific component
 */
export const WriterOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  const { role } = useAuth();
  const allowed = isWriterRole(role) || isAdminRole(role);
  
  if (!allowed) {
    console.log("WriterOnly content hidden: User does not have writer role");
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Admin-specific component
 */
export const AdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  const { role } = useAuth();
  const allowed = isAdminRole(role);
  
  if (!allowed) {
    console.log("AdminOnly content hidden: User does not have admin role");
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component that renders for multiple roles
 */
export const MultiRoleOnly: React.FC<MultiRoleComponentProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const { role } = useAuth();
  const allowed = hasAnyRole(role, roles);
  
  if (!allowed) {
    console.log(`MultiRoleOnly content hidden: User role ${role} not in allowed roles [${roles.join(', ')}]`);
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Designer or Admin only component
 */
export const DesignerOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  const { role } = useAuth();
  const allowed = isDesignerRole(role) || isAdminRole(role);
  
  if (!allowed) {
    console.log("DesignerOrAdminOnly content hidden: User does not have designer or admin role");
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Writer or Admin only component
 */
export const WriterOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  const { role } = useAuth();
  const allowed = isWriterRole(role) || isAdminRole(role);
  
  if (!allowed) {
    console.log("WriterOrAdminOnly content hidden: User does not have writer or admin role");
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component that renders for all except specified roles
 */
export const ExcludeRoles: React.FC<ExcludeRolesProps> = ({ 
  excludeRoles, 
  children, 
  fallback = null 
}) => {
  const { role } = useAuth();
  
  if (!role) {
    console.log("ExcludeRoles defaulting to fallback: No user role defined");
    return <>{fallback}</>;
  }
  
  // Use hasAnyRole in reverse to exclude roles
  const allowed = !hasAnyRole(role, excludeRoles);
  
  if (!allowed) {
    console.log(`ExcludeRoles content hidden: User role ${role} is in excluded roles [${excludeRoles.join(', ')}]`);
  }
  
  return allowed ? <>{children}</> : <>{fallback}</>;
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
  console.warn('EditorOnly is deprecated, use WriterOnly instead');
  return <WriterOnly children={children} fallback={fallback} />;
};

/**
 * @deprecated Use WriterOrAdminOnly instead
 */
export const EditorOrAdminOnly: React.FC<RoleComponentProps> = ({ children, fallback }) => {
  console.warn('EditorOrAdminOnly is deprecated, use WriterOrAdminOnly instead');
  return <WriterOrAdminOnly children={children} fallback={fallback} />;
};

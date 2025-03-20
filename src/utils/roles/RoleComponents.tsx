import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MultiRoleComponentProps, ExcludeRolesProps, RoleComponentProps } from './types';

/**
 * Component that only renders its children when the current user has a specific role
 */
export const RoleComponent: React.FC<MultiRoleComponentProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const { role } = useAuth();
  
  // If user has any of the specified roles, render children
  if (role && roles.includes(role)) {
    return <>{children}</>;
  }
  
  // Otherwise render fallback
  return <>{fallback}</>;
};

/**
 * Component that renders its children for any role EXCEPT the specified roles
 */
export const ExcludeRoles: React.FC<ExcludeRolesProps> = ({ 
  excludeRoles, 
  children, 
  fallback = null 
}) => {
  const { role } = useAuth();
  
  // If user role is in excluded roles list, render fallback
  if (role && excludeRoles.includes(role)) {
    return <>{fallback}</>;
  }
  
  // Otherwise render children
  return <>{children}</>;
};

/**
 * Component that only renders its children for guests (no authenticated user)
 */
export const GuestOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user, role } = useAuth();
  
  // If no user and no role (complete guest), render children
  if (!user && !role) {
    return <>{children}</>;
  }
  
  // Otherwise render fallback
  return <>{fallback}</>;
};

/**
 * Component that only renders its children for authenticated users (including guest roles)
 */
export const AuthenticatedOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user, role } = useAuth();
  
  // If has user or guest role, render children
  if (user || role) {
    return <>{children}</>;
  }
  
  // Otherwise render fallback
  return <>{fallback}</>;
};

/**
 * Component that only renders its children when a user (not guest role) is authenticated
 */
export const UserOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  // Only render if there's an actual user (not just a role)
  return user ? <>{children}</> : <>{fallback}</>;
};

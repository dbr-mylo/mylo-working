
import { ReactNode } from 'react';
import { UserRole } from '@/lib/types';

/**
 * Props for components that render based on a specific role
 */
export interface RoleComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Props for components that render based on multiple roles
 */
export interface MultiRoleComponentProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Props for components that exclude specific roles
 */
export interface ExcludeRolesProps {
  excludeRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}


/**
 * Types for role-based components and hooks
 */

import { UserRole } from '@/lib/types';

export interface RoleComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface MultiRoleComponentProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ExcludeRolesProps {
  excludeRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

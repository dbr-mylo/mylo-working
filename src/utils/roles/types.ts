
import { UserRole } from "@/lib/types";

/**
 * Props for role-specific components
 */
export interface RoleComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Props for multi-role components
 */
export interface MultiRoleComponentProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Props for exclude-roles components
 */
export interface ExcludeRolesProps {
  excludeRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

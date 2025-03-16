
import { UserRole } from "@/lib/types";
import { ReactNode } from "react";

export interface RoleComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface MultiRoleComponentProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ExcludeRolesProps {
  excludeRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

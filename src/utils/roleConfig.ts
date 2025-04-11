
/**
 * Role-based Feature Configuration
 * 
 * This utility provides configuration settings and feature flags
 * based on user roles to maintain separation between writer and designer functions.
 *
 * @deprecated Import from @/utils/roles instead
 */

import { UserRole } from "@/lib/types";
import { 
  getRoleFeatures as getRoleFeaturesInternal, 
  isFeatureEnabled as isFeatureEnabledInternal,
  getRoleUIConfig as getRoleUIConfigInternal,
  RoleFeatureFlags,
  isDesignerRole, 
  isWriterRole,
  isAdminRole,
  isEditorRole
} from './roles/FeatureFlags';

type RoleFeatureFlagsExport = RoleFeatureFlags;
export type { RoleFeatureFlagsExport as RoleFeatureFlags };

/**
 * Get feature configuration for a specific role
 */
export const getRoleFeatures = getRoleFeaturesInternal;

/**
 * Check if a specific feature is enabled for a role
 */
export const isFeatureEnabled = isFeatureEnabledInternal;

/**
 * Get role-specific UI configuration values
 */
export const getRoleUIConfig = getRoleUIConfigInternal;

/**
 * Check if the current role is designer
 */
export const isDesignerRole = isDesignerRole;

/**
 * Check if the current role is writer
 */
export const isWriterRole = isWriterRole;

/**
 * Check if the current role is admin
 */
export const isAdminRole = isAdminRole;

/**
 * @deprecated Use isWriterRole instead
 */
export const isEditorRole = isEditorRole;

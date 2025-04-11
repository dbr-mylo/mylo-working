
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
  RoleFeatureFlags
} from './roles/FeatureFlags';

// Import role functions from the correct location
import {
  isDesignerRole,
  isWriterRole,
  isAdminRole,
  isEditorRole
} from './roles/RoleFunctions';

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
export { isDesignerRole };

/**
 * Check if the current role is writer
 */
export { isWriterRole };

/**
 * Check if the current role is admin
 */
export { isAdminRole };

/**
 * @deprecated Use isWriterRole instead
 */
export { isEditorRole };

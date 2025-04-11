
/**
 * Feature flags for different user roles
 */

import { UserRole } from "@/lib/types";

export interface RoleFeatureFlags {
  canEditTemplates: boolean;
  canPublishTemplates: boolean;
  canCreateDocuments: boolean;
  maxDocuments: number;
  maxProjects: number;
  availableFonts: string[];
  accessLevel: number;
  advanced: {
    canCustomizeCSS: boolean;
    canExportPDF: boolean;
    canBatchProcess: boolean;
  }
}

// Feature flags for different roles
const roleFeatures: Record<string, RoleFeatureFlags> = {
  writer: {
    canEditTemplates: false,
    canPublishTemplates: false,
    canCreateDocuments: true,
    maxDocuments: 50,
    maxProjects: 5,
    availableFonts: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia'],
    accessLevel: 1,
    advanced: {
      canCustomizeCSS: false,
      canExportPDF: true,
      canBatchProcess: false
    }
  },
  designer: {
    canEditTemplates: true,
    canPublishTemplates: true,
    canCreateDocuments: true,
    maxDocuments: 100,
    maxProjects: 15,
    availableFonts: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Roboto', 'Futura', 'Montserrat'],
    accessLevel: 2,
    advanced: {
      canCustomizeCSS: true,
      canExportPDF: true,
      canBatchProcess: false
    }
  },
  admin: {
    canEditTemplates: true,
    canPublishTemplates: true,
    canCreateDocuments: true,
    maxDocuments: 500,
    maxProjects: -1, // unlimited
    availableFonts: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Roboto', 'Futura', 'Montserrat', 'Courier', 'Verdana'],
    accessLevel: 3,
    advanced: {
      canCustomizeCSS: true,
      canExportPDF: true,
      canBatchProcess: true
    }
  }
};

// Default values for when role is not recognized
const defaultFeatures: RoleFeatureFlags = {
  canEditTemplates: false,
  canPublishTemplates: false,
  canCreateDocuments: true,
  maxDocuments: 5,
  maxProjects: 1,
  availableFonts: ['Arial', 'Times New Roman'],
  accessLevel: 0,
  advanced: {
    canCustomizeCSS: false,
    canExportPDF: false,
    canBatchProcess: false
  }
};

/**
 * Get feature configuration for a specific role
 */
export const getRoleFeatures = (role: UserRole | null): RoleFeatureFlags => {
  if (!role) return defaultFeatures;
  return roleFeatures[role] || defaultFeatures;
};

/**
 * Check if a specific feature is enabled for a role
 */
export const isFeatureEnabled = (role: UserRole | null, feature: keyof RoleFeatureFlags): boolean => {
  const features = getRoleFeatures(role);
  
  // Handle nested features
  if (feature.includes('.')) {
    const [parentKey, childKey] = feature.split('.');
    // @ts-ignore - We know the structure matches
    return features[parentKey]?.[childKey] || false;
  }
  
  // @ts-ignore - Simple key access
  return features[feature] || false;
};

/**
 * Get role-specific UI configuration values
 */
export const getRoleUIConfig = <T extends keyof RoleFeatureFlags>(
  role: UserRole | null, 
  configKey: T
): RoleFeatureFlags[T] => {
  const features = getRoleFeatures(role);
  return features[configKey];
};

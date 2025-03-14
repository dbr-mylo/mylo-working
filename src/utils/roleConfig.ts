
/**
 * Role-based Feature Configuration
 * 
 * This utility provides configuration settings and feature flags
 * based on user roles to maintain separation between editor and designer functions.
 */

import { UserRole } from "@/lib/types";

type RoleFeatureFlags = {
  // Page and content features
  canModifyTemplate: boolean;
  canEditLayout: boolean;
  canCreateTemplate: boolean;
  canPublishTemplate: boolean;
  
  // UI features
  showToolbar: boolean;
  showPreview: boolean;
  
  // Styling features
  canApplyStyles: boolean;
  canCreateStyles: boolean;
  
  // Document features
  defaultDocumentWrapper: 'white-page' | 'none' | 'custom';
  
  // View features
  defaultView: 'edit' | 'preview' | 'split';
};

const ROLE_FEATURE_CONFIG: Record<UserRole, RoleFeatureFlags> = {
  designer: {
    canModifyTemplate: true,
    canEditLayout: true,
    canCreateTemplate: true,
    canPublishTemplate: true,
    showToolbar: true,
    showPreview: true,
    canApplyStyles: true,
    canCreateStyles: true,
    defaultDocumentWrapper: 'none',
    defaultView: 'edit'
  },
  editor: {
    canModifyTemplate: false,
    canEditLayout: false,
    canCreateTemplate: false,
    canPublishTemplate: false,
    showToolbar: true,
    showPreview: false,
    canApplyStyles: true,
    canCreateStyles: false,
    defaultDocumentWrapper: 'white-page',
    defaultView: 'split'
  },
  admin: {
    canModifyTemplate: true,
    canEditLayout: true,
    canCreateTemplate: true,
    canPublishTemplate: true,
    showToolbar: true,
    showPreview: true,
    canApplyStyles: true, 
    canCreateStyles: true,
    defaultDocumentWrapper: 'none',
    defaultView: 'edit'
  }
};

/**
 * Get feature configuration for a specific role
 */
export const getRoleFeatures = (role: UserRole | null): RoleFeatureFlags => {
  if (!role) {
    // Default to editor if no role provided
    return ROLE_FEATURE_CONFIG.editor;
  }
  return ROLE_FEATURE_CONFIG[role];
};

/**
 * Check if a specific feature is enabled for a role
 */
export const isFeatureEnabled = (role: UserRole | null, feature: keyof RoleFeatureFlags): boolean => {
  const features = getRoleFeatures(role);
  return features[feature];
};

/**
 * Get role-specific UI configuration values
 */
export const getRoleUIConfig = (role: UserRole | null, configKey: keyof RoleFeatureFlags): any => {
  const features = getRoleFeatures(role);
  return features[configKey];
};

/**
 * Check if the current role is designer
 */
export const isDesignerRole = (role: UserRole | null): boolean => {
  return role === 'designer';
};

/**
 * Check if the current role is editor
 */
export const isEditorRole = (role: UserRole | null): boolean => {
  return role === 'editor';
};

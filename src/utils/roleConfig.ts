
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
  
  // Admin features
  canManageUsers: boolean;
  canManageAllTemplates: boolean;
  canManageAllStyles: boolean;
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
    defaultView: 'edit',
    canManageUsers: false,
    canManageAllTemplates: false,
    canManageAllStyles: false
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
    defaultView: 'split',
    canManageUsers: false,
    canManageAllTemplates: false,
    canManageAllStyles: false
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
    defaultView: 'edit',
    canManageUsers: true,
    canManageAllTemplates: true,
    canManageAllStyles: true
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
  // Need to explicitly check for boolean type to fix the type error
  if (typeof features[feature] === 'boolean') {
    return features[feature] as boolean;
  }
  // For non-boolean values, return false
  return false;
};

/**
 * Get role-specific UI configuration values
 */
export const getRoleUIConfig = <T extends keyof RoleFeatureFlags>(role: UserRole | null, configKey: T): RoleFeatureFlags[T] => {
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

/**
 * Check if the current role is admin
 */
export const isAdminRole = (role: UserRole | null): boolean => {
  return role === 'admin';
};

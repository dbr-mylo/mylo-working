
/**
 * Feature Flags System
 * 
 * This module provides a centralized way to control feature availability
 * based on system state, user role, and application conditions.
 */

import { UserRole } from "@/lib/types";
import { getSystemHealth } from "./systemHealth";

/**
 * Available feature flags in the application
 */
export type FeatureFlagKey = 
  // Critical features
  | 'core-editing'
  | 'document-save'
  | 'auth-session'
  | 'local-backup'
  
  // Non-critical features
  | 'real-time-collaboration'
  | 'template-marketplace'
  | 'advanced-formatting'
  | 'image-uploading'
  | 'commenting'
  | 'revision-history'
  | 'export-features';

/**
 * Feature flag configuration interface
 */
export interface FeatureFlagConfig {
  // Is this a critical feature that should be available even in degraded states?
  critical: boolean;
  
  // Default enabled state
  defaultEnabled: boolean;
  
  // Require specific roles for this feature
  requiredRoles?: UserRole[];
  
  // Require online connectivity
  requiresOnline?: boolean;
  
  // Minimum system health score required (0-100)
  minSystemHealth?: number;
  
  // Override manually (e.g. from admin controls or persistent settings)
  manualOverride?: boolean | null;
  
  // Description for admin UI and debugging
  description?: string;
}

// Feature flag definitions
const featureFlags: Record<FeatureFlagKey, FeatureFlagConfig> = {
  // Critical features - these should remain available when possible
  'core-editing': {
    critical: true,
    defaultEnabled: true,
    requiresOnline: false,
    minSystemHealth: 0, // Always try to keep available
    description: 'Core document editing functionality'
  },
  'document-save': {
    critical: true,
    defaultEnabled: true,
    requiresOnline: false, // Local saving works offline
    minSystemHealth: 10,
    description: 'Ability to save documents locally or remotely'
  },
  'auth-session': {
    critical: true,
    defaultEnabled: true,
    requiresOnline: false, // Use cached session when offline
    minSystemHealth: 20,
    description: 'Authentication and session management'
  },
  'local-backup': {
    critical: true,
    defaultEnabled: true,
    requiresOnline: false,
    minSystemHealth: 0,
    description: 'Local document backup and recovery'
  },
  
  // Non-critical features - can be disabled in degraded states
  'real-time-collaboration': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: true,
    minSystemHealth: 70,
    description: 'Real-time collaboration with other users'
  },
  'template-marketplace': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: true,
    minSystemHealth: 50,
    description: 'Access to template marketplace'
  },
  'advanced-formatting': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: false,
    minSystemHealth: 40,
    description: 'Advanced text formatting options'
  },
  'image-uploading': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: true,
    minSystemHealth: 60,
    description: 'Ability to upload and embed images'
  },
  'commenting': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: true,
    minSystemHealth: 50,
    description: 'Document commenting and annotations'
  },
  'revision-history': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: true,
    minSystemHealth: 60,
    description: 'Access to document revision history'
  },
  'export-features': {
    critical: false,
    defaultEnabled: true,
    requiresOnline: false,
    minSystemHealth: 30,
    description: 'Export documents to various formats'
  }
};

// Store for manual overrides (can be persisted to localStorage)
const manualOverrides: Partial<Record<FeatureFlagKey, boolean>> = {};

// Utility to check if online - using a function instead of direct import
// This avoids React hook rules violations since useOnlineStatus is a hook
function isOnline(): boolean {
  // Default to navigator.onLine if in browser environment
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true; // Default to online in non-browser environments
}

/**
 * Check if a feature is enabled based on current conditions
 * @param feature The feature flag to check
 * @param role Optional user role to check against required roles
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlagKey, role?: UserRole | null): boolean {
  const flagConfig = featureFlags[feature];
  
  if (!flagConfig) {
    console.warn(`Feature flag "${feature}" does not exist`);
    return false;
  }
  
  // Check manual override first
  if (manualOverrides[feature] !== undefined) {
    return manualOverrides[feature] as boolean;
  }
  
  // Check if the feature requires a specific role
  if (flagConfig.requiredRoles && flagConfig.requiredRoles.length > 0) {
    if (!role || !flagConfig.requiredRoles.includes(role)) {
      return false;
    }
  }
  
  // Check online requirement
  if (flagConfig.requiresOnline && !isOnline()) {
    return false;
  }
  
  // Check system health
  if (flagConfig.minSystemHealth !== undefined) {
    const systemHealth = getSystemHealth();
    if (systemHealth < flagConfig.minSystemHealth) {
      return false;
    }
  }
  
  // If all checks pass, use default setting
  return flagConfig.defaultEnabled;
}

/**
 * Set manual override for a feature flag
 * @param feature The feature to override
 * @param enabled Whether to enable or disable the feature
 */
export function setFeatureOverride(feature: FeatureFlagKey, enabled: boolean | null): void {
  if (!featureFlags[feature]) {
    console.warn(`Feature flag "${feature}" does not exist`);
    return;
  }
  
  if (enabled === null) {
    // Remove override
    delete manualOverrides[feature];
  } else {
    // Set override
    manualOverrides[feature] = enabled;
  }
  
  // Persist changes to localStorage
  saveOverridesToStorage();
}

/**
 * Get all available feature flags and their current state
 */
export function getAllFeatureFlags(role?: UserRole | null): Record<FeatureFlagKey, boolean> {
  const result: Record<string, boolean> = {};
  
  for (const feature of Object.keys(featureFlags) as FeatureFlagKey[]) {
    result[feature] = isFeatureEnabled(feature as FeatureFlagKey, role);
  }
  
  return result as Record<FeatureFlagKey, boolean>;
}

/**
 * Get critical feature flags that should remain available
 * during degraded system states
 */
export function getCriticalFeatures(): FeatureFlagKey[] {
  return Object.entries(featureFlags)
    .filter(([_, config]) => config.critical)
    .map(([key]) => key as FeatureFlagKey);
}

/**
 * Get non-critical features that can be disabled in degraded states
 */
export function getNonCriticalFeatures(): FeatureFlagKey[] {
  return Object.entries(featureFlags)
    .filter(([_, config]) => !config.critical)
    .map(([key]) => key as FeatureFlagKey);
}

/**
 * Save manual overrides to localStorage
 */
function saveOverridesToStorage(): void {
  try {
    localStorage.setItem('featureFlagOverrides', JSON.stringify(manualOverrides));
  } catch (e) {
    console.error('Failed to save feature flag overrides:', e);
  }
}

/**
 * Load manual overrides from localStorage
 */
export function loadOverridesFromStorage(): void {
  try {
    const saved = localStorage.getItem('featureFlagOverrides');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Validate and apply saved overrides
      for (const [key, value] of Object.entries(parsed)) {
        if (featureFlags[key as FeatureFlagKey] && typeof value === 'boolean') {
          manualOverrides[key as FeatureFlagKey] = value;
        }
      }
    }
  } catch (e) {
    console.error('Failed to load feature flag overrides:', e);
  }
}

// Initialize by loading any saved overrides
if (typeof window !== 'undefined') {
  loadOverridesFromStorage();
}

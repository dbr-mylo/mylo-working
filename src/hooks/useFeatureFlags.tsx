
import { useEffect, useState } from 'react';
import { 
  FeatureFlagKey, 
  isFeatureEnabled, 
  setFeatureOverride,
  getAllFeatureFlags
} from '@/utils/featureFlags/featureFlags';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if features are enabled and manage feature flags
 */
export function useFeatureFlags() {
  const { role } = useAuth();
  const [flags, setFlags] = useState<Record<FeatureFlagKey, boolean>>({} as Record<FeatureFlagKey, boolean>);
  
  // Update flags whenever role changes
  useEffect(() => {
    setFlags(getAllFeatureFlags(role));
  }, [role]);
  
  /**
   * Check if a specific feature is enabled
   */
  const isEnabled = (feature: FeatureFlagKey): boolean => {
    return isFeatureEnabled(feature, role);
  };
  
  /**
   * Override a feature flag
   */
  const setOverride = (feature: FeatureFlagKey, enabled: boolean | null) => {
    setFeatureOverride(feature, enabled);
    // Update local state
    setFlags(getAllFeatureFlags(role));
  };
  
  return {
    flags,
    isEnabled,
    setOverride
  };
}

/**
 * Component wrapper that conditionally renders based on feature flag
 */
export function FeatureGate({
  feature,
  fallback = null,
  children
}: {
  feature: FeatureFlagKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isEnabled } = useFeatureFlags();
  
  if (isEnabled(feature)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

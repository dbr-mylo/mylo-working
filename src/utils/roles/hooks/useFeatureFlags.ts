
/**
 * Hook for accessing role-based feature flags
 */
import { useAuth } from '@/contexts/AuthContext';
import { 
  getRoleFeatures, 
  isFeatureEnabled, 
  getRoleUIConfig,
  RoleFeatureFlags
} from '../FeatureFlags';

/**
 * Hook that provides access to role-specific feature flags
 */
export const useFeatureFlags = () => {
  const { role } = useAuth();
  
  // Get all feature flags for the current role
  const features = getRoleFeatures(role);
  
  // Check if a specific feature is enabled
  const isEnabled = (feature: keyof RoleFeatureFlags): boolean => {
    return isFeatureEnabled(role, feature);
  };
  
  // Get a specific UI configuration value
  const getUIConfig = <T extends keyof RoleFeatureFlags>(configKey: T): RoleFeatureFlags[T] => {
    return getRoleUIConfig(role, configKey);
  };
  
  return {
    features,
    isEnabled,
    getUIConfig
  };
};


/**
 * Hook for role-specific cache clearing behavior
 */
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole, isDesignerRole } from '../RoleFunctions';

/**
 * Hook that provides role-specific cache clearing functionality
 */
export const useCacheClearing = () => {
  const { role } = useAuth();

  const clearCache = useCallback(() => {
    if (isAdminRole(role)) {
      // Admin can clear all caches
      console.log('Clearing all caches (admin role)');
      return true;
    } else if (isDesignerRole(role)) {
      // Designer can clear design-related caches
      console.log('Clearing design caches (designer role)');
      return true;
    } else {
      // Writers and other roles have limited cache clearing
      console.log('Limited cache clearing available for this role');
      return false;
    }
  }, [role]);

  return { clearCache };
};

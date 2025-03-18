
/**
 * useCacheClearing Hook
 * 
 * A specialized hook for clearing cache in a role-appropriate way.
 * This prevents duplication of cache-clearing logic across components.
 */

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { textStyleStore } from '@/stores/textStyles';
import { toast } from '@/components/ui/use-toast';

export const useCacheClearing = () => {
  const { role } = useAuth();

  /**
   * Clear all caches related to the current role
   */
  const clearAllCaches = useCallback(() => {
    try {
      if (role === 'designer') {
        // Designers need deeper cache cleaning
        textStyleStore.deepCleanStorage();
        toast({
          title: "Design caches cleared",
          description: "All style caches have been reset to defaults."
        });
      } else {
        // Editors just need font/color cache clearing
        textStyleStore.clearEditorCache();
        textStyleStore.clearDefaultResetStyle();
        toast({
          title: "Editor caches cleared",
          description: "Editor-specific caches have been refreshed."
        });
      }
      
      console.log(`Caches cleared for ${role} role`);
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast({
        title: "Error clearing caches",
        description: "There was a problem clearing the caches. Please try again.",
        variant: "destructive"
      });
    }
  }, [role]);

  return {
    clearAllCaches
  };
};

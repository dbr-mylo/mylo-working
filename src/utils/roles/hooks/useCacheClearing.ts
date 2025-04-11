
/**
 * Hook for role-specific cache clearing behavior
 */
import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole, isDesignerRole } from '../RoleFunctions';
import { toast } from 'sonner';

/**
 * Hook that provides role-specific cache clearing functionality
 */
export const useCacheClearing = () => {
  const { role } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = useCallback(() => {
    setIsClearing(true);
    
    try {
      if (isAdminRole(role)) {
        // Admin can clear all caches
        console.log('Clearing all caches (admin role)');
        
        // Clear localStorage caches
        const cacheKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('editor_') || key.startsWith('template_') || key.includes('cache')
        );
        
        cacheKeys.forEach(key => localStorage.removeItem(key));
        
        // Dispatch cache clear events
        document.dispatchEvent(new CustomEvent('tiptap-clear-font-cache'));
        document.dispatchEvent(new CustomEvent('clear-application-cache'));
        
        toast.success("All caches cleared successfully");
        return true;
      } else if (isDesignerRole(role)) {
        // Designer can clear design-related caches
        console.log('Clearing design caches (designer role)');
        
        // Clear only design-related caches
        const designCacheKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('template_') || key.includes('style')
        );
        
        designCacheKeys.forEach(key => localStorage.removeItem(key));
        
        toast.success("Design caches cleared successfully");
        return true;
      } else {
        // Writers and other roles have limited cache clearing
        console.log('Limited cache clearing available for this role');
        
        // Clear only writer-specific caches
        const writerCacheKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('editor_font_') || key.includes('recent')
        );
        
        writerCacheKeys.forEach(key => localStorage.removeItem(key));
        
        toast.success("Editor caches cleared successfully");
        return false;
      }
    } catch (error) {
      console.error("Error clearing caches:", error);
      toast.error("Failed to clear caches");
      return false;
    } finally {
      setTimeout(() => {
        setIsClearing(false);
      }, 500);
    }
  }, [role]);

  return { clearCache, isClearing };
};

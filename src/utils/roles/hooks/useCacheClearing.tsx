
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook for clearing application caches
 * 
 * This hook provides functionality to clear various caches in the application.
 * The component using this hook is responsible for checking admin permissions.
 */
export const useCacheClearing = () => {
  const [isClearing, setIsClearing] = useState(false);

  const clearLocalStorageCache = () => {
    try {
      // Clear editor-related caches
      localStorage.removeItem('editor_font_size');
      localStorage.removeItem('editor_recent_colors');
      
      // Clear any template caches
      const templateKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('template_') || key.includes('cache')
      );
      
      templateKeys.forEach(key => localStorage.removeItem(key));
      
      toast.success("Local storage cache cleared successfully");
    } catch (error) {
      console.error("Error clearing local storage:", error);
      toast.error("Failed to clear local storage cache");
    }
  };

  const clearMemoryCache = () => {
    try {
      setIsClearing(true);
      
      // Dispatch cache clear events
      document.dispatchEvent(new CustomEvent('tiptap-clear-font-cache'));
      document.dispatchEvent(new CustomEvent('clear-application-cache'));
      
      // Force reload styles
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.removeChild(el);
          parent.appendChild(el);
        }
      });
      
      toast.success("Memory cache cleared successfully");
    } catch (error) {
      console.error("Error clearing memory cache:", error);
      toast.error("Failed to clear memory cache");
    } finally {
      setIsClearing(false);
    }
  };

  const clearAllCaches = () => {
    clearLocalStorageCache();
    clearMemoryCache();
    toast.success("All caches cleared successfully");
  };

  return {
    isClearing,
    clearLocalStorageCache,
    clearMemoryCache,
    clearAllCaches
  };
};

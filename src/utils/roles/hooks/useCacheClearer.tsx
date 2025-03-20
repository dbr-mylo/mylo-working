
import { useState } from 'react';
import { toast } from 'sonner';
import { textStyleStore } from '@/stores/textStyles';
import { TemplateCache } from '@/services/template/TemplateCache';

/**
 * Hook for clearing all application caches
 * 
 * This hook provides functions to clear various cache types:
 * - Local storage caches (editor settings, styles, etc.)
 * - Memory caches (styles, templates, etc.)
 * - Template caches
 */
export const useCacheClearer = () => {
  const [isClearing, setIsClearing] = useState(false);

  /**
   * Clear all local storage caches 
   */
  const clearLocalStorageCaches = () => {
    try {
      console.log("Clearing local storage caches");
      
      // Clear editor-related caches
      localStorage.removeItem('editor_font_size');
      localStorage.removeItem('editor_recent_colors');
      localStorage.removeItem('cachedFontSize');
      localStorage.removeItem('editorFontCache');
      localStorage.removeItem('editorColorCache');
      
      // Clear cache keys that match patterns
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('cache') || 
        key.includes('style') || 
        key.includes('template') ||
        key.includes('font')
      );
      
      console.log(`Found ${cacheKeys.length} cache keys to clear`);
      cacheKeys.forEach(key => localStorage.removeItem(key));
      
      toast.success(`Cleared ${cacheKeys.length} local storage caches`);
    } catch (error) {
      console.error("Error clearing local storage caches:", error);
      toast.error("Failed to clear local storage caches");
    }
  };

  /**
   * Clear all in-memory caches 
   */
  const clearMemoryCaches = () => {
    try {
      setIsClearing(true);
      
      // Trigger styles cache clearing
      textStyleStore.clearAllStyleCaches();
      textStyleStore.clearDefaultResetStyle();
      textStyleStore.clearEditorCache();
      
      // Dispatch cache clear events for other components
      document.dispatchEvent(new CustomEvent('tiptap-clear-font-cache'));
      document.dispatchEvent(new CustomEvent('clear-application-cache'));
      document.dispatchEvent(new CustomEvent('clear-template-cache'));
      
      console.log("Cleared in-memory caches");
      toast.success("Cleared in-memory caches");
    } catch (error) {
      console.error("Error clearing memory caches:", error);
      toast.error("Failed to clear memory caches");
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Clear template caches
   */
  const clearTemplateCaches = () => {
    try {
      // Clear template caches
      const templateCache = new TemplateCache();
      templateCache.clearCache();
      
      console.log("Cleared template caches");
      toast.success("Cleared template caches");
    } catch (error) {
      console.error("Error clearing template caches:", error);
      toast.error("Failed to clear template caches");
    }
  };

  /**
   * Clear all caches
   */
  const clearAllCaches = () => {
    setIsClearing(true);
    
    try {
      clearLocalStorageCaches();
      clearMemoryCaches();
      clearTemplateCaches();
      
      console.log("All caches cleared successfully");
      toast.success("All application caches cleared successfully");
    } catch (error) {
      console.error("Error clearing all caches:", error);
      toast.error("Failed to clear all caches");
    } finally {
      setIsClearing(false);
    }
  };

  return {
    isClearing,
    clearLocalStorageCaches,
    clearMemoryCaches,
    clearTemplateCaches,
    clearAllCaches
  };
};

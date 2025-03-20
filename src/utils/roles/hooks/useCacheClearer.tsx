
import { useState } from 'react';
import { toast } from 'sonner';
import { clearCaches } from '@/utils/clearCache';

/**
 * Hook for clearing application caches
 * @returns Object containing cache clearing state and function
 */
export const useCacheClearer = () => {
  const [isClearing, setIsClearing] = useState(false);

  const clearAllCaches = async () => {
    try {
      setIsClearing(true);
      toast.info('Clearing application caches...');
      
      // Clear localStorage caches
      localStorage.removeItem('templateCache');
      localStorage.removeItem('styleCache');
      localStorage.removeItem('documentCache');
      
      // Clear all template and style data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('template_') || key.startsWith('style_') || key.startsWith('document_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Use the Node.js utility script if available
      if (typeof clearCaches === 'function') {
        await clearCaches(() => {
          console.log('Cache clearing completed via Node.js utility');
        });
      }
      
      // Dispatch custom event to notify components about cache clearing
      const cacheClearEvent = new CustomEvent('app-cache-cleared');
      document.dispatchEvent(cacheClearEvent);
      
      // Reload fonts and styles in the editor
      const fontCacheEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(fontCacheEvent);
      
      toast.success('All caches cleared successfully');
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('Failed to clear some caches');
    } finally {
      setIsClearing(false);
    }
  };

  return { isClearing, clearAllCaches };
};

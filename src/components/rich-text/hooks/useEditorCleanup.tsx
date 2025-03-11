
import { useEffect } from 'react';
import { textStyleStore } from '@/stores/textStyles';

export const useEditorCleanup = () => {
  // Clear font caches on mount
  useEffect(() => {
    console.log("useEditorSetup: Clearing font caches");
    textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
    localStorage.removeItem('editor_font_size');
    
    // Force a clear cache event
    try {
      const clearEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(clearEvent);
    } catch (error) {
      console.error("Error dispatching clear cache event:", error);
    }
  }, []);
};

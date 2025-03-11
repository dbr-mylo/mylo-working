
import { useEffect } from 'react';
import { textStyleStore } from '@/stores/textStyles';

export const useEditorCleanup = () => {
  useEffect(() => {
    // Perform cleanup to ensure consistent editor experience
    try {
      // Clear font-related caches
      textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
      
      // Clear localStorage cache for font size
      localStorage.removeItem('editor_font_size');
      
      console.log("Editor cleanup performed");
    } catch (error) {
      console.error("Error during editor cleanup:", error);
    }
    
    return () => {
      // No cleanup needed on unmount
    };
  }, []);
};

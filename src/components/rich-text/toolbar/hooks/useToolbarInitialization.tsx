
import { useEffect } from 'react';
import { textStyleStore } from '@/stores/textStyles';

export const useToolbarInitialization = () => {
  // Clear all cached styles/preferences on component mount
  useEffect(() => {
    try {
      // Clear any potentially stored font sizes from localStorage
      localStorage.removeItem('editor_font_size');
      
      // Clear cached text styles
      textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize']);
      
      console.log("EditorToolbar: Cleared font size cache");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, []);
};

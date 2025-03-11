
import { useEffect } from 'react';
import { textStyleStore } from '@/stores/textStyles';

export const EditorInitializer = () => {
  useEffect(() => {
    console.log("RichTextEditor: Initializing and clearing font caches");
    
    // Clear font size cache from storage
    localStorage.removeItem('editor_font_size');
    
    // Clear text style cache related to fonts and sizes
    textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
    
    // Dispatch cache clear event for other components
    const clearEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(clearEvent);
  }, []);

  return null;
};

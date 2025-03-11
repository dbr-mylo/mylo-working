
import { useEffect } from 'react';
import { textStyleStore } from '@/stores/textStyles';

export const EditorInitializer = () => {
  useEffect(() => {
    console.log("RichTextEditor: Clearing cache and resetting styles on mount");
    // Clear font size cache
    localStorage.removeItem('editor_font_size');
    sessionStorage.removeItem('editor_font_size');
    
    // Clear text style caches
    textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
    textStyleStore.clearEditorCache();
    
    // Clean up any previous events
    const cleanupEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(cleanupEvent);
  }, []);

  return null;
};

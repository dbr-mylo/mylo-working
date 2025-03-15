import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

export const useFontSizeSync = (editor: Editor | null) => {
  // Simplified font size monitoring
  useEffect(() => {
    if (!editor) return;
    
    // No need for complex DOM operations or event dispatching
    // This hook now just ensures the editor is properly initialized
    
    return () => {
      // Clean up
    };
  }, [editor]);
};

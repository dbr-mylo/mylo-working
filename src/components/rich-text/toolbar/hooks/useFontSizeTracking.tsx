
import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useEditorFontSizeState } from './useEditorFontSizeState';
import { useFontSizeEventHandling } from './useFontSizeEventHandling';

export const useFontSizeTracking = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  
  // Get font size state from editor
  const editorFontSizeState = useEditorFontSizeState(editor);
  
  // Update current font size when editor state changes
  useCallback(() => {
    if (editorFontSizeState.currentFontSize !== currentFontSize) {
      setCurrentFontSize(editorFontSizeState.currentFontSize);
    }
  }, [editorFontSizeState.currentFontSize, currentFontSize]);
  
  // Handle events that change font size
  useFontSizeEventHandling({
    onFontSizeChange: (fontSize: string) => {
      setCurrentFontSize(fontSize);
      
      // If size comes from DOM, immediately verify with editor and update if needed
      if (editor && editor.isActive) {
        setTimeout(() => {
          if (editor.isActive) {
            editor.chain().focus().setFontSize(fontSize).run();
          }
        }, 10);
      }
    }
  });

  const handleFontSizeChange = useCallback((fontSize: string) => {
    if (!editor) return;
    
    console.log("EditorToolbar: Setting font size to:", fontSize);
    // Update state and editor
    setCurrentFontSize(fontSize);
    editor.chain().focus().setFontSize(fontSize).run();
    
    // Force a refresh of font cache
    setTimeout(() => {
      const refreshEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(refreshEvent);
    }, 10);
  }, [editor]);

  return {
    currentFontSize,
    isTextSelected: editorFontSizeState.isTextSelected,
    handleFontSizeChange
  };
};

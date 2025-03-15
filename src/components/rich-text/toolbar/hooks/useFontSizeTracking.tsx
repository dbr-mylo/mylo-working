
import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useEditorFontSizeState } from './useEditorFontSizeState';
import { useFontSizeEventHandling } from './useFontSizeEventHandling';
import { getDomFontSize } from './utils/domFontSizeUtils';
import { useToast } from '@/hooks/use-toast';
import { parseFontSize, formatFontSize } from '@/components/rich-text/font-size/utils';

export const useFontSizeTracking = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const { toast } = useToast();
  
  // Get font size state from editor
  const editorFontSizeState = useEditorFontSizeState(editor);
  
  // Initialize state from editor
  useEffect(() => {
    console.log("Font size tracking: Initial state from editor:", editorFontSizeState.currentFontSize, 
      "isTextSelected:", editorFontSizeState.isTextSelected);
    
    if (editorFontSizeState.currentFontSize !== currentFontSize) {
      setCurrentFontSize(editorFontSizeState.currentFontSize);
    }
  }, []);
  
  // Update current font size when editor state changes
  useEffect(() => {
    if (editorFontSizeState.currentFontSize !== currentFontSize) {
      console.log("Updating font size from editor state:", editorFontSizeState.currentFontSize);
      setCurrentFontSize(editorFontSizeState.currentFontSize);
    }
  }, [editorFontSizeState.currentFontSize, currentFontSize]);
  
  // Handle events that change font size
  useFontSizeEventHandling({
    onFontSizeChange: (fontSize: string) => {
      console.log("Font size event received:", fontSize);
      setCurrentFontSize(fontSize);
    }
  });

  // Check DOM directly for a more accurate font size
  useEffect(() => {
    if (!editor) return;
    
    const checkDomFontSize = () => {
      const domSize = getDomFontSize(editor);
      if (domSize && domSize !== currentFontSize) {
        console.log("Direct DOM font size check detected:", domSize);
        setCurrentFontSize(domSize);
      }
    };
    
    // Check on selection and transaction events
    const handleUpdate = () => {
      if (editorFontSizeState.isTextSelected) {
        checkDomFontSize();
      }
    };
    
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    
    // Initial check
    const timeoutId = setTimeout(checkDomFontSize, 100);
    
    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      clearTimeout(timeoutId);
    };
  }, [editor, currentFontSize, editorFontSizeState.isTextSelected]);

  const handleFontSizeChange = useCallback((fontSize: string) => {
    if (!editor) return;
    
    console.log("EditorToolbar: Setting font size to:", fontSize);
    
    // Make sure fontSize is in the correct format
    const numericSize = parseFontSize(fontSize);
    const formattedSize = formatFontSize(numericSize);
    
    // Update state and editor
    setCurrentFontSize(formattedSize);
    editor.chain().focus().setFontSize(formattedSize).run();
    
    // Force a refresh of font cache
    const timeoutId = setTimeout(() => {
      const refreshEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(refreshEvent);
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [editor]);

  return {
    currentFontSize,
    isTextSelected: editorFontSizeState.isTextSelected,
    handleFontSizeChange
  };
};

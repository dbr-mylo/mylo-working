
import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { getDomFontSize } from './utils/domFontSizeUtils';

export const useEditorFontSizeState = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isTextSelected, setIsTextSelected] = useState(false);
  
  // Update font size from DOM and editor
  const updateFontSize = useCallback(() => {
    if (!editor) return;
    
    // First try to get from editor attributes
    const editorFontSize = editor.getAttributes('textStyle').fontSize;
    
    // Then check actual DOM for the real font size (highest priority)
    const domFontSize = getDomFontSize(editor);
    
    if (domFontSize) {
      // DOM font size takes precedence as it's the most accurate
      console.log("EditorToolbar: DOM font size:", domFontSize, 
        editorFontSize ? `(editor reports: ${editorFontSize})` : '');
      
      if (domFontSize !== currentFontSize) {
        setCurrentFontSize(domFontSize);
        
        // Also update the editor's font size attribute to match DOM
        if (editor.isActive && (!editorFontSize || editorFontSize !== domFontSize)) {
          setTimeout(() => {
            if (editor.isActive) {
              editor.chain().focus().setFontSize(domFontSize).run();
            }
          }, 10);
        }
      }
    } else if (editorFontSize) {
      // Fall back to editor's font size if DOM check failed
      console.log("EditorToolbar: Using editor font size:", editorFontSize);
      setCurrentFontSize(editorFontSize);
    }
  }, [editor, currentFontSize]);

  // Track text selection state
  const updateTextSelection = useCallback(() => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    
    console.log("EditorToolbar: Text selection update, isSelected:", hasSelection);
    setIsTextSelected(hasSelection);
    
    // When text is selected, check its font size
    if (hasSelection) {
      updateFontSize();
    }
  }, [editor, updateFontSize]);
  
  // Set up editor event listeners
  useEffect(() => {
    if (!editor) return;
    
    // Initial update for selection state
    updateTextSelection();
    
    // Force an immediate check for text selection
    const initialCheck = () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      console.log("EditorToolbar: Initial selection check:", hasSelection);
      setIsTextSelected(hasSelection);
      
      if (hasSelection) {
        updateFontSize();
      }
    };
    
    // Run initial check after a short delay to ensure editor is ready
    const timeoutId = setTimeout(initialCheck, 50);
    
    // Add event listeners to editor
    const handleSelectionUpdate = () => {
      updateTextSelection();
      updateFontSize();
    };
    
    const handleTransaction = () => {
      updateTextSelection();
      updateFontSize();
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleTransaction);
    
    return () => {
      // Clean up event listeners
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleTransaction);
      clearTimeout(timeoutId);
    };
  }, [editor, updateFontSize, updateTextSelection]);
  
  return {
    currentFontSize,
    isTextSelected
  };
};


import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { getDomFontSize } from './utils/domFontSizeUtils';

export const useEditorFontSizeState = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isTextSelected, setIsTextSelected] = useState(false);
  
  // Update text selection state
  const updateTextSelection = useCallback(() => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    
    setIsTextSelected(hasSelection);
  }, [editor]);
  
  // Update font size from DOM and editor
  const updateFontSize = useCallback(() => {
    if (!editor || !isTextSelected) return;
    
    // First try to get from editor attributes
    const editorFontSize = editor.getAttributes('textStyle').fontSize;
    
    // Then check actual DOM for the real font size
    const domFontSize = getDomFontSize(editor);
    
    if (domFontSize) {
      // Only update if font size actually changed
      if (domFontSize !== currentFontSize) {
        setCurrentFontSize(domFontSize);
      }
    } else if (editorFontSize && editorFontSize !== currentFontSize) {
      setCurrentFontSize(editorFontSize);
    }
  }, [editor, currentFontSize, isTextSelected]);

  // Set up editor event listeners
  useEffect(() => {
    if (!editor) return;
    
    // Initial update for selection state
    updateTextSelection();
    
    const handleSelectionUpdate = () => {
      updateTextSelection();
    };
    
    const handleTransaction = () => {
      updateTextSelection();
      // Only update font size if there is text selected
      if (editor.state.selection.from !== editor.state.selection.to) {
        setTimeout(updateFontSize, 10);
      }
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleTransaction);
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleTransaction);
    };
  }, [editor, updateFontSize, updateTextSelection]);
  
  // Update font size when text is selected
  useEffect(() => {
    if (isTextSelected) {
      updateFontSize();
    }
  }, [isTextSelected, updateFontSize]);
  
  return {
    currentFontSize,
    isTextSelected
  };
};

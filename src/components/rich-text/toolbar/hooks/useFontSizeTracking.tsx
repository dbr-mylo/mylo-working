
import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { parseFontSize, formatFontSize } from '@/components/rich-text/font-size/utils';

export const useFontSizeTracking = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isTextSelected, setIsTextSelected] = useState(false);
  
  // Track text selection state
  useEffect(() => {
    if (!editor) return;
    
    const checkSelection = () => {
      const { from, to } = editor.state.selection;
      setIsTextSelected(from !== to);
    };
    
    // Initial check
    checkSelection();
    
    // Listen for selection changes
    editor.on('selectionUpdate', checkSelection);
    
    return () => {
      editor.off('selectionUpdate', checkSelection);
    };
  }, [editor]);
  
  // Track font size from editor
  useEffect(() => {
    if (!editor || !isTextSelected) return;
    
    const updateFontSize = () => {
      const fontSize = editor.getAttributes('textStyle').fontSize;
      if (fontSize && fontSize !== currentFontSize) {
        setCurrentFontSize(fontSize);
      }
    };
    
    updateFontSize();
    
    // Listen for changes that might affect font size
    const handleTransaction = () => {
      if (isTextSelected) {
        updateFontSize();
      }
    };
    
    editor.on('transaction', handleTransaction);
    
    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor, isTextSelected, currentFontSize]);

  // Handle font size change from user input
  const handleFontSizeChange = useCallback((fontSize: string) => {
    if (!editor || !isTextSelected) return;
    
    try {
      // Format the font size
      const numericSize = parseFontSize(fontSize);
      const formattedSize = formatFontSize(numericSize);
      
      // Update state
      setCurrentFontSize(formattedSize);
      
      // Update editor
      editor.chain().focus().setFontSize(formattedSize).run();
    } catch (error) {
      console.error("Error changing font size:", error);
    }
  }, [editor, isTextSelected]);

  return {
    currentFontSize,
    isTextSelected,
    handleFontSizeChange
  };
};

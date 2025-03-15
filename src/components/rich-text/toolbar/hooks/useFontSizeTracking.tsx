
import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { parseFontSize, formatFontSize } from '@/components/rich-text/font-size/utils';

export const useFontSizeTracking = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isTextSelected, setIsTextSelected] = useState(false);
  
  // Track text selection state with debounce to prevent excessive updates
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
  
  // Track font size from editor with reduced update frequency
  useEffect(() => {
    if (!editor || !isTextSelected) return;
    
    const updateFontSize = () => {
      const fontSize = editor.getAttributes('textStyle').fontSize;
      if (fontSize && fontSize !== currentFontSize) {
        setCurrentFontSize(fontSize);
      }
    };
    
    // Initial update
    updateFontSize();
    
    // Use a throttled handler for transaction updates
    let timeoutId: NodeJS.Timeout | null = null;
    
    const handleTransaction = () => {
      if (!isTextSelected) return;
      
      // Clear any pending update
      if (timeoutId) clearTimeout(timeoutId);
      
      // Schedule update with 50ms delay to reduce processing frequency
      timeoutId = setTimeout(() => {
        updateFontSize();
        timeoutId = null;
      }, 50);
    };
    
    editor.on('transaction', handleTransaction);
    
    return () => {
      editor.off('transaction', handleTransaction);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [editor, isTextSelected, currentFontSize]);

  // Fix the handleFontSizeChange function to properly update the font size
  const handleFontSizeChange = useCallback((fontSize: string) => {
    if (!editor || !isTextSelected) return;
    
    try {
      // Ensure fontSize has px suffix
      const numericSize = parseFontSize(fontSize);
      const formattedSize = formatFontSize(numericSize);
      
      // Update UI first
      setCurrentFontSize(formattedSize);
      
      // Force the editor command to execute synchronously
      editor.chain()
        .focus()
        .setFontSize(formattedSize)
        .run();
      
      // Dispatch a custom event to force a style update
      const event = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(event);
      
      // Log to debug
      console.log("Applied font size:", formattedSize);
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

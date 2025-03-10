import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { textStyleStore } from '@/stores/textStyles';

export const useFontSizeTracking = (editor: Editor | null) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isTextSelected, setIsTextSelected] = useState(false);

  // Function to get font size directly from DOM
  const getDomFontSize = useCallback(() => {
    if (!editor || !editor.view) return null;
    
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // If no real selection, try to get from cursor position
        if (range.collapsed) {
          // Get the node at cursor position
          const node = range.startContainer;
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            const style = window.getComputedStyle(node.parentElement);
            return style.fontSize;
          }
        } else {
          // For text selection, create a temporary span to compute style
          const span = document.createElement('span');
          const clonedRange = range.cloneRange();
          const fragment = clonedRange.cloneContents();
          
          if (fragment.firstChild) {
            // Check direct style on first child if it's an element
            if (fragment.firstChild.nodeType === Node.ELEMENT_NODE) {
              const style = window.getComputedStyle(fragment.firstChild as Element);
              return style.fontSize;
            }
            
            // Otherwise check computed style
            span.appendChild(fragment);
            document.body.appendChild(span);
            const style = window.getComputedStyle(span);
            const fontSize = style.fontSize;
            document.body.removeChild(span);
            return fontSize;
          }
        }
      }
    } catch (error) {
      console.error("Error getting DOM font size:", error);
    }
    
    return null;
  }, [editor]);
  
  // Function to update font size from events
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (event.detail && event.detail.fontSize) {
      console.log(`EditorToolbar: Font size change event (${event.detail.source || 'unknown'})`, event.detail.fontSize);
      setCurrentFontSize(event.detail.fontSize);
      
      // If size comes from DOM, immediately verify with editor and update if needed
      if (event.detail.source === 'dom' && editor && editor.isActive) {
        setTimeout(() => {
          if (editor.isActive) {
            editor.chain().focus().setFontSize(event.detail.fontSize).run();
          }
        }, 10);
      }
    }
  }, [editor]);
  
  // Listen for font size change events from the FontSize extension
  useEffect(() => {
    // Add event listeners with proper typing
    document.addEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    document.addEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
      document.removeEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);
  
  // Monitor editor for font size changes and check DOM for actual values
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      // First try to get from editor attributes
      const editorFontSize = editor.getAttributes('textStyle').fontSize;
      
      // Then check actual DOM for the real font size (highest priority)
      const domFontSize = getDomFontSize();
      
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
    };

    const updateTextSelection = () => {
      const { from, to } = editor.state.selection;
      const isSelected = from !== to;
      setIsTextSelected(isSelected);
      
      // When text is selected, check its font size
      if (isSelected) {
        updateFontSize();
      }
    };
    
    // Add event listeners to editor
    editor.on('selectionUpdate', updateFontSize);
    editor.on('selectionUpdate', updateTextSelection);
    editor.on('transaction', updateFontSize);
    
    // Initial update
    updateFontSize();
    updateTextSelection();
    
    return () => {
      // Clean up event listeners
      editor.off('selectionUpdate', updateFontSize);
      editor.off('selectionUpdate', updateTextSelection);
      editor.off('transaction', updateFontSize);
    };
  }, [editor, currentFontSize, getDomFontSize]);

  const handleFontSizeChange = (fontSize: string) => {
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
  };

  return {
    currentFontSize,
    isTextSelected,
    handleFontSizeChange
  };
};

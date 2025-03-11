import { Editor } from '@tiptap/react';

/**
 * Gets the font size from the DOM based on current text selection
 */
export const getDomFontSize = (editor: Editor | null): string | null => {
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
};

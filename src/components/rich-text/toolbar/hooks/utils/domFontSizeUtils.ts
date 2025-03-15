
import { Editor } from '@tiptap/react';

/**
 * Gets the font size from the DOM based on current text selection
 * Simplified to avoid performance issues
 */
export const getDomFontSize = (editor: Editor | null): string | null => {
  if (!editor || !editor.view) return null;
  
  try {
    // Get directly from editor attributes first (fastest)
    const editorFontSize = editor.getAttributes('textStyle').fontSize;
    if (editorFontSize) return editorFontSize;
    
    // Only do DOM operations if we couldn't get from editor
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return null;
    
    // Get parent element of selection
    const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer as Element;
    
    if (!parentElement || !(parentElement instanceof Element)) return null;
    
    // Get computed style
    const style = window.getComputedStyle(parentElement);
    return style.fontSize;
  } catch (error) {
    console.error("Error getting DOM font size:", error);
    return null;
  }
};

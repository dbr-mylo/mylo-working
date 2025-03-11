
import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

export const useFontSizeSync = (editor: Editor | null) => {
  // Monitor font size changes with improved detection
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      try {
        // Get from editor attributes
        const { fontSize } = editor.getAttributes('textStyle');
        
        if (fontSize) {
          console.log("Font size detected in selection (editor attributes):", fontSize);
          
          // Direct DOM check for verification
          const { view } = editor;
          if (view && view.dom) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              if (!range.collapsed) {
                // For text selection, check the actual DOM element
                const node = range.commonAncestorContainer;
                let element: Element | null = null;
                
                if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                  element = node.parentElement;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                  element = node as Element;
                }
                
                if (element) {
                  const domFontSize = window.getComputedStyle(element).fontSize;
                  console.log("DOM verification for fontSize:", domFontSize, "vs editor:", fontSize);
                  
                  // If DOM and editor values differ, prefer DOM
                  if (domFontSize && domFontSize !== fontSize) {
                    console.log("DOM font size differs, using DOM value:", domFontSize);
                    
                    // Set the correct font size in editor to match DOM
                    editor.chain().focus().setFontSize(domFontSize).run();
                    
                    // Broadcast the font size from DOM for sync
                    const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                      detail: { fontSize: domFontSize, source: 'dom-verify' }
                    });
                    document.dispatchEvent(fontSizeEvent);
                    return;
                  }
                }
              }
            }
          }
          
          // Only broadcast if DOM verification didn't override
          const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
            detail: { fontSize }
          });
          document.dispatchEvent(fontSizeEvent);
        }
      } catch (error) {
        console.error("Error detecting font size:", error);
      }
    };
    
    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);
    
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);
};

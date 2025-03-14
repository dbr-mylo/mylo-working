
import { useEffect } from 'react';

interface UseDomFontSizeObserverProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  onChange: (value: string) => void;
  disabled: boolean;
  getNumericValue: (fontSizeValue: string) => number;
}

export const useDomFontSizeObserver = ({
  size,
  setSize,
  onChange,
  disabled,
  getNumericValue
}: UseDomFontSizeObserverProps) => {
  // Check DOM directly for font size in selection whenever selection changes
  useEffect(() => {
    if (disabled) return;
    
    const checkDomFontSize = () => {
      try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            // For text selection, get a direct DOM measurement
            const selectedNode = range.commonAncestorContainer;
            let targetElement: HTMLElement | null = null;
            
            if (selectedNode.nodeType === Node.TEXT_NODE && selectedNode.parentElement) {
              targetElement = selectedNode.parentElement;
            } else if (selectedNode.nodeType === Node.ELEMENT_NODE) {
              targetElement = selectedNode as HTMLElement;
            }
            
            if (targetElement) {
              // Check if element has inline style first
              let domFontSize = targetElement.style.fontSize;
              
              // If no inline style, use computed style
              if (!domFontSize) {
                domFontSize = window.getComputedStyle(targetElement).fontSize;
              }
              
              if (domFontSize) {
                const newSize = getNumericValue(domFontSize);
                console.log("FontSizeInput: DOM font size check:", domFontSize, "parsed to:", newSize);
                
                if (Math.abs(newSize - size) > 0.1) {
                  setSize(newSize);
                  onChange(`${newSize}px`);
                  
                  // Broadcast to other components
                  const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                    detail: { fontSize: domFontSize, source: 'direct-dom-check' }
                  });
                  document.dispatchEvent(fontSizeEvent);
                }
              }
            }
          }
        }
      } catch (error) {
        // Safely ignore errors during DOM inspection
        console.error("Error checking DOM font size:", error);
      }
    };
    
    // Check DOM on selection change
    document.addEventListener('selectionchange', checkDomFontSize);
    return () => {
      document.removeEventListener('selectionchange', checkDomFontSize);
    };
  }, [size, onChange, disabled, getNumericValue, setSize]);
};

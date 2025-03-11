
import { useEffect } from 'react';
import { formatFontSize } from '../utils';
import { EVENT_SOURCES } from '../constants';

interface UseDomFontSizeDetectionProps {
  size: number;
  setSize: (size: number) => void;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const useDomFontSizeDetection = ({
  size,
  setSize,
  onChange,
  disabled
}: UseDomFontSizeDetectionProps) => {
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
                processDomFontSize(domFontSize, size, setSize, onChange);
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
  }, [disabled, size, setSize, onChange]);
};

// Helper function to process DOM font size
function processDomFontSize(
  domFontSize: string, 
  currentSize: number, 
  setSize: (size: number) => void, 
  onChange: (value: string) => void
) {
  // Import these here to avoid circular dependencies
  const { parseFontSize } = require('../utils');
  const { DEFAULT_FONT_SIZE } = require('../constants');
  
  const newSize = parseFontSize(domFontSize, DEFAULT_FONT_SIZE);
  console.log("FontSizeInput: DOM font size check:", domFontSize, "parsed to:", newSize);
  
  if (Math.abs(newSize - currentSize) > 0.1) {
    setSize(newSize);
    onChange(formatFontSize(newSize));
    
    // Broadcast to other components
    const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
      detail: { 
        fontSize: domFontSize, 
        source: EVENT_SOURCES.DIRECT_DOM_CHECK 
      }
    });
    document.dispatchEvent(fontSizeEvent);
  }
}

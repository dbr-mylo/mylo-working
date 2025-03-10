
import { useState, useEffect, useCallback } from 'react';
import { textStyleStore } from '@/stores/textStyles';

interface UseFontSizeStateProps {
  initialValue: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const useFontSizeState = ({ initialValue, onChange, disabled }: UseFontSizeStateProps) => {
  // Constants for min/max font size values according to requirements
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 99;

  // Extract the numeric value from the font size string (e.g., "16px" -> 16)
  const getNumericValue = (fontSizeValue: string): number => {
    if (!fontSizeValue) return 16; // Default size if no value provided
    const match = String(fontSizeValue).match(/^(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 16; // Default to 16 if parsing fails
  };

  const initialSize = getNumericValue(initialValue);
  const [size, setSize] = useState<number>(initialSize);
  
  // Log initial value received
  useEffect(() => {
    console.log("FontSizeInput: Initialized with value:", initialValue, "parsed to size:", initialSize);
  }, []);
  
  // Handler for font size events with priority for DOM-sourced values
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (!event.detail || !event.detail.fontSize) return;
    
    // Prioritize DOM-sourced values for accurate representation
    const source = event.detail.source || 'unknown';
    const isDomSource = source.includes('dom');
    const newSize = getNumericValue(event.detail.fontSize);
    
    console.log(`FontSizeInput: Received font size event (${source})`, 
      event.detail.fontSize, "parsed to:", newSize, "current size:", size);
    
    // Always update from DOM source or if size is different
    if (isDomSource || Math.abs(newSize - size) > 0.1) {
      setSize(newSize);
      // Propagate changes from DOM to ensure toolbar matches DOM
      if (!disabled) {
        onChange(`${newSize}px`);
      }
    }
  }, [size, onChange, disabled]);
  
  // Update internal state when external value changes
  useEffect(() => {
    const newSize = getNumericValue(initialValue);
    if (Math.abs(newSize - size) > 0.1) {
      console.log("FontSizeInput: Value prop changed to:", initialValue, "internal size updated to:", newSize);
      setSize(newSize);
    }
  }, [initialValue]);

  // Listen for font size events from the editor
  useEffect(() => {
    // Clear any cached styles
    try {
      textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize']);
    } catch (error) {
      console.error("Error clearing font size cache:", error);
    }
    
    // Add event listeners with proper typing
    document.addEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    document.addEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
      document.removeEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);

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
  }, [size, onChange, disabled]);

  const incrementSize = () => {
    if (disabled) return;
    const newSize = Math.min(size + 1, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
    
    // Dispatch event for other components
    try {
      const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
        detail: { fontSize: `${newSize}px`, source: 'input' }
      });
      document.dispatchEvent(fontSizeEvent);
    } catch (error) {
      console.error("Error dispatching font size event:", error);
    }
  };

  const decrementSize = () => {
    if (disabled) return;
    const newSize = Math.max(size - 1, MIN_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
    
    // Dispatch event for other components
    try {
      const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
        detail: { fontSize: `${newSize}px`, source: 'input' }
      });
      document.dispatchEvent(fontSizeEvent);
    } catch (error) {
      console.error("Error dispatching font size event:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/[^\d.]/g, ''); // Allow digits and decimal point
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseFloat(inputValue);
    // Enforce min/max limits
    newSize = Math.max(Math.min(newSize, MAX_FONT_SIZE), 0);
    
    // Round to one decimal place for better usability
    newSize = Math.round(newSize * 10) / 10;
    
    setSize(newSize);
    console.log("FontSizeInput: Manual change to:", newSize);
    
    // Only update if value is within acceptable range
    if (newSize >= MIN_FONT_SIZE) {
      onChange(`${newSize}px`);
      
      // Dispatch event for other components
      try {
        const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: `${newSize}px`, source: 'input' }
        });
        document.dispatchEvent(fontSizeEvent);
      } catch (error) {
        console.error("Error dispatching font size event:", error);
      }
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    
    // When blurring, ensure the value is within range
    if (size < MIN_FONT_SIZE) {
      const newSize = MIN_FONT_SIZE;
      console.log("FontSizeInput: Correcting size to minimum:", newSize);
      setSize(newSize);
      onChange(`${newSize}px`);
      
      // Dispatch event for other components
      try {
        const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: `${newSize}px`, source: 'input' }
        });
        document.dispatchEvent(fontSizeEvent);
      } catch (error) {
        console.error("Error dispatching font size event:", error);
      }
    }
  };

  return {
    size,
    handleInputChange,
    handleBlur,
    incrementSize,
    decrementSize,
  };
};

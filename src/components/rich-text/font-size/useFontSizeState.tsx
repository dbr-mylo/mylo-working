
import { useState, useEffect, useCallback } from 'react';
import { textStyleStore } from '@/stores/textStyles';
import { 
  parseFontSize, 
  formatFontSize, 
  dispatchFontSizeEvent, 
  clampFontSize 
} from './utils';
import { 
  MIN_FONT_SIZE, 
  MAX_FONT_SIZE, 
  DEFAULT_FONT_SIZE,
  FONT_SIZE_CHANGE_EVENT,
  FONT_SIZE_PARSED_EVENT,
  EVENT_SOURCES
} from './constants';

interface UseFontSizeStateProps {
  initialValue: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const useFontSizeState = ({ initialValue, onChange, disabled }: UseFontSizeStateProps) => {
  // Get initial numeric value from the font size string
  const initialSize = parseFontSize(initialValue, DEFAULT_FONT_SIZE);
  const [size, setSize] = useState<number>(initialSize);
  
  // Log initial value received
  useEffect(() => {
    console.log("FontSizeInput: Initialized with value:", initialValue, "parsed to size:", initialSize);
  }, []);
  
  // Handler for font size events with priority for DOM-sourced values
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (!event.detail || !event.detail.fontSize) return;
    
    // Prioritize DOM-sourced values for accurate representation
    const source = event.detail.source || EVENT_SOURCES.UNKNOWN;
    const isDomSource = source.includes('dom');
    const newSize = parseFontSize(event.detail.fontSize, DEFAULT_FONT_SIZE);
    
    console.log(`FontSizeInput: Received font size event (${source})`, 
      event.detail.fontSize, "parsed to:", newSize, "current size:", size);
    
    // Always update from DOM source or if size is different
    if (isDomSource || Math.abs(newSize - size) > 0.1) {
      setSize(newSize);
      // Propagate changes from DOM to ensure toolbar matches DOM
      if (!disabled) {
        onChange(formatFontSize(newSize));
      }
    }
  }, [size, onChange, disabled]);
  
  // Update internal state when external value changes
  useEffect(() => {
    const newSize = parseFontSize(initialValue, DEFAULT_FONT_SIZE);
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
    document.addEventListener(FONT_SIZE_CHANGE_EVENT, handleFontSizeEvent as EventListener);
    document.addEventListener(FONT_SIZE_PARSED_EVENT, handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener(FONT_SIZE_CHANGE_EVENT, handleFontSizeEvent as EventListener);
      document.removeEventListener(FONT_SIZE_PARSED_EVENT, handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);

  // Check DOM directly for font size in selection whenever selection changes
  useEffect(useDomFontSizeDetection(size, setSize, onChange, disabled), [size, onChange, disabled]);

  // Handle incrementing the font size
  const incrementSize = () => {
    if (disabled) return;
    const newSize = clampFontSize(size + 1, MIN_FONT_SIZE, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(formatFontSize(newSize));
    
    // Dispatch event for other components
    dispatchFontSizeEvent(formatFontSize(newSize), EVENT_SOURCES.INPUT);
  };

  // Handle decrementing the font size
  const decrementSize = () => {
    if (disabled) return;
    const newSize = clampFontSize(size - 1, MIN_FONT_SIZE, MAX_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(formatFontSize(newSize));
    
    // Dispatch event for other components
    dispatchFontSizeEvent(formatFontSize(newSize), EVENT_SOURCES.INPUT);
  };

  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/[^\d.]/g, ''); // Allow digits and decimal point
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseFloat(inputValue);
    // Round to one decimal place for better usability
    newSize = Math.round(newSize * 10) / 10;
    
    setSize(newSize);
    console.log("FontSizeInput: Manual change to:", newSize);
    
    // Only update if value is within acceptable range
    if (newSize >= MIN_FONT_SIZE) {
      onChange(formatFontSize(newSize));
      dispatchFontSizeEvent(formatFontSize(newSize), EVENT_SOURCES.INPUT);
    }
  };

  // Handle blur events for validation
  const handleBlur = () => {
    if (disabled) return;
    
    // When blurring, ensure the value is within range
    if (size < MIN_FONT_SIZE) {
      const newSize = MIN_FONT_SIZE;
      console.log("FontSizeInput: Correcting size to minimum:", newSize);
      setSize(newSize);
      onChange(formatFontSize(newSize));
      dispatchFontSizeEvent(formatFontSize(newSize), EVENT_SOURCES.INPUT);
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

// Extract DOM font size detection to a separate function for clarity
const useDomFontSizeDetection = (
  size: number, 
  setSize: (size: number) => void,
  onChange: (value: string) => void, 
  disabled: boolean
) => {
  return () => {
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
                const newSize = parseFontSize(domFontSize, DEFAULT_FONT_SIZE);
                console.log("FontSizeInput: DOM font size check:", domFontSize, "parsed to:", newSize);
                
                if (Math.abs(newSize - size) > 0.1) {
                  setSize(newSize);
                  onChange(formatFontSize(newSize));
                  
                  // Broadcast to other components
                  const fontSizeEvent = new CustomEvent(FONT_SIZE_PARSED_EVENT, {
                    detail: { 
                      fontSize: domFontSize, 
                      source: EVENT_SOURCES.DIRECT_DOM_CHECK 
                    }
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
  };
};

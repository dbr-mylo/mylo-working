
import { useCallback, useEffect, useRef } from 'react';
import { textStyleStore } from '@/stores/textStyles';
import { dispatchFontSizeEvent } from '../utils';

interface UseFontSizeEventsProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  onChange: (value: string) => void;
  disabled: boolean;
  getNumericValue: (fontSizeValue: string) => number;
}

export const useFontSizeEvents = ({
  size,
  setSize,
  onChange,
  disabled,
  getNumericValue
}: UseFontSizeEventsProps) => {
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
  }, [size, onChange, disabled, getNumericValue, setSize]);
  
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

  return { handleFontSizeEvent };
};

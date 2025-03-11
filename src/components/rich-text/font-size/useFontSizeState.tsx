
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
import { useFontSizeEventHandling } from './hooks/useFontSizeEventHandling';
import { useDomFontSizeDetection } from './hooks/useDomFontSizeDetection';

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
  
  // Use font size event handling from separate hook
  const handleFontSizeEvent = useFontSizeEventHandling({
    size,
    setSize,
    onChange,
    disabled
  });
  
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

  // Update internal state when external value changes
  useEffect(() => {
    const newSize = parseFontSize(initialValue, DEFAULT_FONT_SIZE);
    if (Math.abs(newSize - size) > 0.1) {
      console.log("FontSizeInput: Value prop changed to:", initialValue, "internal size updated to:", newSize);
      setSize(newSize);
    }
  }, [initialValue, size]);

  // Check DOM directly for font size in selection whenever selection changes
  useDomFontSizeDetection({
    size,
    setSize,
    onChange,
    disabled
  });

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

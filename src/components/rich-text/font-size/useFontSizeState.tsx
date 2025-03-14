
import { useState, useEffect, useCallback, useRef } from 'react';
import { textStyleStore } from '@/stores/textStyles';
import { 
  parseFontSize, 
  formatFontSize, 
  dispatchFontSizeEvent, 
  clampFontSize,
  validateFontSize
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
  onInvalidSize?: (message: string) => void;
  onFontSizeChange?: (fontSize: string) => void;
}

export const useFontSizeState = ({ 
  initialValue, 
  onChange, 
  disabled, 
  onInvalidSize,
  onFontSizeChange
}: UseFontSizeStateProps) => {
  // Get initial numeric value from the font size string
  const initialSize = parseFontSize(initialValue, DEFAULT_FONT_SIZE);
  const [size, setSize] = useState<number>(initialSize);
  const [lastValidSize, setLastValidSize] = useState<number>(initialSize);
  
  // Debounce timer reference
  const debounceTimerRef = useRef<number | null>(null);
  
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
      
      // Clear any existing debounce timer
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleFontSizeEvent]);

  // Update internal state when external value changes
  useEffect(() => {
    const newSize = parseFontSize(initialValue, DEFAULT_FONT_SIZE);
    if (Math.abs(newSize - size) > 0.1) {
      console.log("FontSizeInput: Value prop changed to:", initialValue, "internal size updated to:", newSize);
      setSize(newSize);
      setLastValidSize(newSize);
    }
  }, [initialValue, size]);

  // Check DOM directly for font size in selection whenever selection changes
  useDomFontSizeDetection({
    size,
    setSize,
    onChange,
    disabled
  });

  // Debounced function to update font size with feedback
  const debouncedSizeUpdate = (newSize: number) => {
    // Clear existing timer
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Validate size before applying
    const validation = validateFontSize(newSize);
    
    if (validation.isValid) {
      setLastValidSize(newSize);
      
      // Set new timer for applying changes
      debounceTimerRef.current = window.setTimeout(() => {
        const formattedSize = formatFontSize(newSize);
        onChange(formattedSize);
        dispatchFontSizeEvent(formattedSize, EVENT_SOURCES.INPUT);
        
        // Provide feedback if callback exists
        if (onFontSizeChange) {
          onFontSizeChange(formattedSize);
        }
        
        debounceTimerRef.current = null;
      }, 250); // 250ms debounce
    } else {
      // Handle invalid size
      if (onInvalidSize && validation.message) {
        onInvalidSize(validation.message);
      }
      
      // If there's a corrected size, use it
      if (validation.correctedSize !== undefined) {
        setSize(validation.correctedSize);
        setLastValidSize(validation.correctedSize);
        
        // Apply the corrected size
        const formattedSize = formatFontSize(validation.correctedSize);
        onChange(formattedSize);
        dispatchFontSizeEvent(formattedSize, EVENT_SOURCES.INPUT);
        
        // Provide feedback if callback exists
        if (onFontSizeChange) {
          onFontSizeChange(formattedSize);
        }
      }
    }
  };

  // Handle incrementing the font size
  const incrementSize = () => {
    if (disabled) return;
    const newSize = clampFontSize(size + 1, MIN_FONT_SIZE, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    debouncedSizeUpdate(newSize);
  };

  // Handle decrementing the font size
  const decrementSize = () => {
    if (disabled) return;
    const newSize = clampFontSize(size - 1, MIN_FONT_SIZE, MAX_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    debouncedSizeUpdate(newSize);
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
      debouncedSizeUpdate(newSize);
    }
  };

  // Handle blur events for validation
  const handleBlur = () => {
    if (disabled) return;
    
    // Validate size on blur
    const validation = validateFontSize(size);
    
    if (!validation.isValid) {
      // Show validation message
      if (onInvalidSize && validation.message) {
        onInvalidSize(validation.message);
      }
      
      // Use corrected size if available
      if (validation.correctedSize !== undefined) {
        setSize(validation.correctedSize);
        setLastValidSize(validation.correctedSize);
        
        const formattedSize = formatFontSize(validation.correctedSize);
        onChange(formattedSize);
        dispatchFontSizeEvent(formattedSize, EVENT_SOURCES.INPUT);
        
        // Provide feedback if callback exists
        if (onFontSizeChange) {
          onFontSizeChange(formattedSize);
        }
      }
    }
  };

  // Handle preset selection from dropdown
  const handlePresetSelect = (presetValue: string) => {
    if (disabled) return;
    
    const newSize = parseFontSize(presetValue, DEFAULT_FONT_SIZE);
    console.log("FontSizeInput: Preset selected:", presetValue, "parsed to:", newSize);
    
    setSize(newSize);
    setLastValidSize(newSize);
    
    // Apply changes immediately for presets (no debounce)
    onChange(presetValue);
    dispatchFontSizeEvent(presetValue, EVENT_SOURCES.INPUT);
    
    // Provide feedback for preset changes
    if (onFontSizeChange) {
      onFontSizeChange(presetValue);
    }
  };

  return {
    size,
    handleInputChange,
    handleBlur,
    incrementSize,
    decrementSize,
    handlePresetSelect,
    lastValidSize,
  };
};


import { useCallback } from 'react';
import { formatFontSize, clampFontSize } from '../utils';
import { EVENT_SOURCES } from '../constants';

interface UseFontSizeActionsProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  onChange: (value: string) => void;
  disabled: boolean;
  MIN_FONT_SIZE: number;
  MAX_FONT_SIZE: number;
}

export const useFontSizeActions = ({
  size,
  setSize,
  onChange,
  disabled,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE
}: UseFontSizeActionsProps) => {
  const incrementSize = useCallback(() => {
    if (disabled) return;
    const newSize = Math.min(size + 1, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    
    // Important: Call onChange with the properly formatted size
    const formattedSize = formatFontSize(newSize);
    onChange(formattedSize);
    
    // Dispatch a custom event to force a style update
    try {
      const event = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error dispatching font cache event:", error);
    }
  }, [size, setSize, onChange, disabled, MAX_FONT_SIZE]);

  const decrementSize = useCallback(() => {
    if (disabled) return;
    const newSize = Math.max(size - 1, MIN_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    
    // Important: Call onChange with the properly formatted size
    const formattedSize = formatFontSize(newSize);
    onChange(formattedSize);
    
    // Dispatch a custom event to force a style update
    try {
      const event = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error dispatching font cache event:", error);
    }
  }, [size, setSize, onChange, disabled, MIN_FONT_SIZE]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/[^\d.]/g, ''); // Allow digits and decimal point
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseFloat(inputValue);
    // Enforce min/max limits
    newSize = clampFontSize(newSize, 0, MAX_FONT_SIZE);
    
    // Round to one decimal place for better usability
    newSize = Math.round(newSize * 10) / 10;
    
    console.log("FontSizeInput: Manual change to:", newSize);
    setSize(newSize);
    
    // Only update if value is within acceptable range
    if (newSize >= MIN_FONT_SIZE) {
      const formattedSize = formatFontSize(newSize);
      onChange(formattedSize);
    }
  }, [disabled, setSize, onChange, MIN_FONT_SIZE, MAX_FONT_SIZE]);

  const handleBlur = useCallback(() => {
    if (disabled) return;
    
    // When blurring, ensure the value is within range
    if (size < MIN_FONT_SIZE) {
      const newSize = MIN_FONT_SIZE;
      console.log("FontSizeInput: Correcting size to minimum:", newSize);
      setSize(newSize);
      
      const formattedSize = formatFontSize(newSize);
      onChange(formattedSize);
    }
  }, [disabled, size, MIN_FONT_SIZE, setSize, onChange]);

  return {
    incrementSize,
    decrementSize,
    handleInputChange,
    handleBlur
  };
};

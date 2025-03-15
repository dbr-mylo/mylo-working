
import { useState, useCallback, useEffect } from 'react';
import { useFontSizeActions } from './useFontSizeActions';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../constants';

interface UseFontSizeStateProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const useFontSizeState = ({ 
  value, 
  onChange, 
  disabled = false 
}: UseFontSizeStateProps) => {
  // Extract the numeric value from the font size string (e.g., "16px" -> 16)
  const getNumericValue = (fontSizeValue: string): number => {
    if (!fontSizeValue) return 16; // Default size if no value provided
    const match = String(fontSizeValue).match(/^(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 16; // Default to 16 if parsing fails
  };

  const initialSize = getNumericValue(value);
  const [size, setSize] = useState<number>(initialSize);
  
  // Update internal state when external value changes (with debounce)
  useEffect(() => {
    const newSize = getNumericValue(value);
    if (Math.abs(newSize - size) > 0.1) {
      setSize(newSize);
    }
  }, [value, size]);

  const {
    incrementSize,
    decrementSize,
    handleInputChange,
    handleBlur
  } = useFontSizeActions({
    size,
    setSize,
    onChange,
    disabled,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE
  });

  return {
    size,
    incrementSize,
    decrementSize,
    handleInputChange,
    handleBlur,
    MIN_FONT_SIZE,
    MAX_FONT_SIZE
  };
};

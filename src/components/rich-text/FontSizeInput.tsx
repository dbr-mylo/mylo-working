
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { clearCachedStylesByPattern } from '@/stores/textStyles/styleCache';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FontSizeInput = ({ value, onChange, className, disabled = false }: FontSizeInputProps) => {
  // Constant for min/max font size values according to requirements
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 99;

  // Extract the numeric value from the font size string (e.g., "16px" -> 16)
  const getNumericValue = (fontSizeValue: string): number => {
    const match = fontSizeValue.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 16; // Default to 16 if parsing fails
  };

  const [size, setSize] = useState<number>(getNumericValue(value));
  
  // Update internal state when external value changes
  useEffect(() => {
    const newSize = getNumericValue(value);
    if (newSize !== size) {
      setSize(newSize);
      console.log("FontSizeInput: Value prop changed to:", value, "internal size updated to:", newSize);
    }
  }, [value, size]);

  // Clear caches on component mount to reset any stored values
  useEffect(() => {
    clearCachedStylesByPattern(['font-size']);
    localStorage.removeItem('editor_font_size');
  }, []);

  const incrementSize = () => {
    if (disabled) return;
    const newSize = Math.min(size + 1, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
  };

  const decrementSize = () => {
    if (disabled) return;
    const newSize = Math.max(size - 1, MIN_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/\D/g, '');
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseInt(inputValue, 10);
    // Enforce min/max limits
    newSize = Math.max(Math.min(newSize, MAX_FONT_SIZE), 0);
    
    setSize(newSize);
    console.log("FontSizeInput: Manual change to:", newSize);
    
    // Only update if value is within acceptable range
    if (newSize >= MIN_FONT_SIZE) {
      onChange(`${newSize}px`);
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
    } else if (size > MAX_FONT_SIZE) {
      const newSize = MAX_FONT_SIZE;
      console.log("FontSizeInput: Correcting size to maximum:", newSize);
      setSize(newSize);
      onChange(`${newSize}px`);
    }
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}>
        <Input
          type="text"
          value={size}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-10 h-7 px-0"
          maxLength={2}
          disabled={disabled}
          style={{ 
            textAlign: 'left',
            paddingLeft: '0.375rem',
            padding: '0.25rem 0 0.25rem 0.375rem'
          }}
        />
        <div className="absolute right-0 flex flex-col h-full">
          <button 
            type="button"
            onClick={incrementSize}
            disabled={disabled}
            className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Increase font size"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button 
            type="button"
            onClick={decrementSize}
            disabled={disabled}
            className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Decrease font size"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

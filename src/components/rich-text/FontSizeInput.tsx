
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FontSizeInput = ({ value, onChange, className }: FontSizeInputProps) => {
  // Extract the numeric value from the font size string (e.g., "16px" -> 16)
  const getNumericValue = (fontSizeValue: string): number => {
    const match = fontSizeValue.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 16; // Default to 16 if parsing fails
  };

  const [size, setSize] = useState<number>(getNumericValue(value));

  // Update internal state when external value changes
  useEffect(() => {
    setSize(getNumericValue(value));
  }, [value]);

  const incrementSize = () => {
    const newSize = Math.min(size + 1, 99); // Maximum size is 99
    setSize(newSize);
    onChange(`${newSize}px`);
  };

  const decrementSize = () => {
    const newSize = Math.max(size - 1, 1); // Minimum size is 1
    setSize(newSize);
    onChange(`${newSize}px`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    // Ensure the value doesn't exceed 99
    if (parseInt(inputValue, 10) > 99) {
      inputValue = '99';
    }
    
    const newSize = parseInt(inputValue, 10);
    setSize(newSize);
    onChange(`${newSize}px`);
  };

  const handleBlur = () => {
    // Ensure minimum value is 1 when user leaves field
    if (size < 1) {
      setSize(1);
      onChange("1px");
    }
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className="relative flex items-center">
        <Input
          type="text"
          value={size}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-10 h-7 px-0"
          maxLength={2}
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
            className="flex items-center justify-center h-3.5 w-4 hover:bg-gray-100"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button 
            type="button"
            onClick={decrementSize}
            className="flex items-center justify-center h-3.5 w-4 hover:bg-gray-100"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

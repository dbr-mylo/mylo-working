
import React from 'react';
import { Input } from '@/components/ui/input';
import { useFontSizeState } from './hooks/useFontSizeState';
import { FontSizeStepper } from './components/FontSizeStepper';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FontSizeInput: React.FC<FontSizeInputProps> = ({ 
  value, 
  onChange, 
  className, 
  disabled = false 
}) => {
  const {
    size,
    incrementSize,
    decrementSize,
    handleInputChange,
    handleBlur
  } = useFontSizeState({
    value,
    onChange,
    disabled
  });

  // Log font size changes
  React.useEffect(() => {
    console.log("FontSizeInput render with value:", value, "size:", size);
  }, [value, size]);

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}>
        <Input
          type="text"
          value={size}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-10 h-7 px-0 text-xs"
          maxLength={4}
          disabled={disabled}
          style={{ 
            textAlign: 'left',
            paddingLeft: '0.375rem',
            padding: '0.25rem 0 0.25rem 0.375rem'
          }}
        />
        <FontSizeStepper
          onIncrement={incrementSize}
          onDecrement={decrementSize}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

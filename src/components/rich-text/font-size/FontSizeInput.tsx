
import React from 'react';
import { useFontSizeState } from './useFontSizeState';
import { FontSizeControls } from './FontSizeControls';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FontSizeInput = ({ value, onChange, className, disabled = false }: FontSizeInputProps) => {
  const {
    size,
    handleInputChange,
    handleBlur,
    incrementSize,
    decrementSize,
  } = useFontSizeState({
    initialValue: value,
    onChange,
    disabled,
  });

  return (
    <div className={`flex items-center ${className || ''}`}>
      <FontSizeControls
        size={size}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        onIncrement={incrementSize}
        onDecrement={decrementSize}
        disabled={disabled}
      />
    </div>
  );
};


import React from 'react';
import { useFontSizeState } from './useFontSizeState';
import { FontSizeControls } from './FontSizeControls';
import { useToast } from '@/hooks/use-toast';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FontSizeInput = ({ value, onChange, className, disabled = false }: FontSizeInputProps) => {
  const { toast } = useToast();
  
  const {
    size,
    handleInputChange,
    handleBlur,
    incrementSize,
    decrementSize,
    handlePresetSelect,
    lastValidSize,
  } = useFontSizeState({
    initialValue: value,
    onChange,
    disabled,
    onInvalidSize: (message) => {
      toast({
        title: "Invalid font size",
        description: message,
        variant: "destructive",
      });
    },
    onFontSizeChange: (newSize) => {
      // Only show feedback for significant changes or when using presets
      if (Math.abs(parseFloat(newSize) - lastValidSize) >= 2) {
        toast({
          title: "Font size updated",
          description: `Text size set to ${newSize}`,
          duration: 1500,
        });
      }
    },
  });

  return (
    <div className={`flex items-center ${className || ''}`}>
      <FontSizeControls
        size={size}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        onIncrement={incrementSize}
        onDecrement={decrementSize}
        onPresetSelect={handlePresetSelect}
        disabled={disabled}
      />
    </div>
  );
};

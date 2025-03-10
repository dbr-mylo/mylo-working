
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FontSizeControlsProps {
  size: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
}

export const FontSizeControls = ({
  size,
  onInputChange,
  onBlur,
  onIncrement,
  onDecrement,
  disabled
}: FontSizeControlsProps) => {
  return (
    <div className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}>
      <Input
        type="text"
        value={size}
        onChange={onInputChange}
        onBlur={onBlur}
        className="w-10 h-7 px-0"
        maxLength={4} // Allow for decimals like "10.5"
        disabled={disabled}
        style={{ 
          textAlign: 'left',
          paddingLeft: '0.375rem',
          padding: '0.25rem 0 0.25rem 0.375rem'
        }}
      />
      <FontSizeStepper 
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        disabled={disabled}
      />
    </div>
  );
};

interface FontSizeStepperProps {
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
}

const FontSizeStepper = ({ onIncrement, onDecrement, disabled }: FontSizeStepperProps) => {
  return (
    <div className="absolute right-0 flex flex-col h-full">
      <button 
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
        aria-label="Increase font size"
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button 
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
        aria-label="Decrease font size"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
};

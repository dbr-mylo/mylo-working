
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FontSizeStepperProps {
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
}

export const FontSizeStepper: React.FC<FontSizeStepperProps> = ({
  onIncrement,
  onDecrement,
  disabled
}) => {
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


import React from 'react';
import { FontSizeInput } from './FontSizeInput';
import { FontSizeDropdown } from './FontSizeDropdown';

interface CombinedFontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CombinedFontSizeControl: React.FC<CombinedFontSizeControlProps> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <FontSizeInput 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
      />
      <FontSizeDropdown 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
      />
    </div>
  );
};

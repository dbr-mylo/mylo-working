
import React from 'react';
import { FontSizeInput } from '../font-size/FontSizeInput';

interface FontSizeControlsProps {
  currentFontSize: string;
  isTextSelected: boolean;
  onFontSizeChange: (fontSize: string) => void;
  className?: string;
}

export const FontSizeControls: React.FC<FontSizeControlsProps> = ({
  currentFontSize,
  isTextSelected,
  onFontSizeChange,
  className = "ml-1 mr-1"
}) => {
  return (
    <FontSizeInput 
      value={currentFontSize} 
      onChange={onFontSizeChange} 
      className={className}
      disabled={!isTextSelected}
    />
  );
};

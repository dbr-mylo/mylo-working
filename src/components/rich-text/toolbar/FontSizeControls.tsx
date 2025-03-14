
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeInput } from '../font-size';

interface FontSizeControlsProps {
  editor: Editor;
  currentFontSize: string;
  isTextSelected: boolean;
  onFontSizeChange: (fontSize: string) => void;
}

export const FontSizeControls: React.FC<FontSizeControlsProps> = ({
  editor,
  currentFontSize,
  isTextSelected,
  onFontSizeChange
}) => {
  return (
    <FontSizeInput 
      value={currentFontSize} 
      onChange={onFontSizeChange} 
      className="ml-1 mr-1"
      disabled={!isTextSelected}
    />
  );
};

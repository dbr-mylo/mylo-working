
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeInput } from '../font-size/FontSizeInput';

interface FontSizeSectionProps {
  editor: Editor;
  currentFontSize: string;
  isTextSelected: boolean;
  onFontSizeChange: (fontSize: string) => void;
}

export const FontSizeSection: React.FC<FontSizeSectionProps> = ({
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

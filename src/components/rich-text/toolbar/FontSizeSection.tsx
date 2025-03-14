
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeControls } from './FontSizeControls';

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
    <FontSizeControls 
      currentFontSize={currentFontSize}
      isTextSelected={isTextSelected}
      onFontSizeChange={onFontSizeChange}
    />
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeControls } from './FontSizeControls';

interface FontSizeSectionProps {
  editor: Editor;
  currentFontSize: string;
  isTextSelected: boolean;
  onFontSizeChange: (fontSize: string) => void;
  className?: string;
}

export const FontSizeSection: React.FC<FontSizeSectionProps> = ({
  editor,
  currentFontSize,
  isTextSelected,
  onFontSizeChange,
  className
}) => {
  return (
    <FontSizeControls 
      currentFontSize={currentFontSize}
      isTextSelected={isTextSelected}
      onFontSizeChange={onFontSizeChange}
      className={className}
    />
  );
};

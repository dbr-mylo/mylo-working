
import React from 'react';
import { Editor } from '@tiptap/react';
import { CombinedFontSizeControl } from '../font-size/CombinedFontSizeControl';

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
    <CombinedFontSizeControl 
      value={currentFontSize}
      onChange={onFontSizeChange}
      disabled={!isTextSelected}
      className={className}
    />
  );
};

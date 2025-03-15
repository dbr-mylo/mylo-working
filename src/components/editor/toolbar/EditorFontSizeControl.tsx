
import React from 'react';
import { Editor } from '@tiptap/react';
import { CombinedFontSizeControl } from '@/components/rich-text/font-size';
import { useFontSizeTracking } from '@/components/rich-text/toolbar/hooks/useFontSizeTracking';

interface EditorFontSizeControlProps {
  editor: Editor;
  className?: string;
}

export const EditorFontSizeControl: React.FC<EditorFontSizeControlProps> = ({
  editor,
  className
}) => {
  const { 
    currentFontSize, 
    isTextSelected, 
    handleFontSizeChange 
  } = useFontSizeTracking(editor);

  return (
    <CombinedFontSizeControl 
      value={currentFontSize}
      onChange={handleFontSizeChange}
      disabled={!isTextSelected}
      className={className}
    />
  );
};

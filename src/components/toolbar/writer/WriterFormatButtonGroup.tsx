
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseFormatButtonGroup } from '../base/BaseFormatButtonGroup';

interface WriterFormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const WriterFormatButtonGroup: React.FC<WriterFormatButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  // Remove role checking since parent component already handles this
  return (
    <BaseFormatButtonGroup 
      editor={editor} 
      currentColor={currentColor} 
      size="xs" 
    />
  );
};

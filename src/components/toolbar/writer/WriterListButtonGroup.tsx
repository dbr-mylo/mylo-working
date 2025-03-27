
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseListButtonGroup } from '../base/BaseListButtonGroup';

interface WriterListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const WriterListButtonGroup: React.FC<WriterListButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  // Remove redundant role checking since parent component already does this
  return (
    <BaseListButtonGroup 
      editor={editor} 
      currentColor={currentColor} 
      size="xs" 
    />
  );
};

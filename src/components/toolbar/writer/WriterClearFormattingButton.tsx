
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseClearFormattingButton } from '../base/BaseClearFormattingButton';

interface WriterClearFormattingButtonProps {
  editor: Editor;
}

export const WriterClearFormattingButton: React.FC<WriterClearFormattingButtonProps> = ({
  editor
}) => {
  // Remove redundant role checking since parent component already does this
  return (
    <BaseClearFormattingButton 
      editor={editor} 
      size="xs"
      showLabel={true}
    />
  );
};

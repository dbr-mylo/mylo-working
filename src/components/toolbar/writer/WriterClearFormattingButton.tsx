
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseClearFormattingButton } from '../base/BaseClearFormattingButton';
import { useIsWriter } from '@/utils/roles';

interface WriterClearFormattingButtonProps {
  editor: Editor;
}

export const WriterClearFormattingButton: React.FC<WriterClearFormattingButtonProps> = ({
  editor
}) => {
  const isWriter = useIsWriter();
  
  // Check if this component is used in the correct role context
  if (!isWriter) {
    console.warn("WriterClearFormattingButton used outside of writer role context");
    return null;
  }
  
  return (
    <BaseClearFormattingButton 
      editor={editor} 
      size="xs"
      showLabel={true}
    />
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseFormatButtonGroup } from '../base/BaseFormatButtonGroup';
import { useIsWriter } from '@/utils/roles';

interface WriterFormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const WriterFormatButtonGroup: React.FC<WriterFormatButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  const isWriter = useIsWriter();
  
  // Check if this component is used in the correct role context
  if (!isWriter) {
    console.warn("WriterFormatButtonGroup used outside of writer role context");
    return null;
  }
  
  return (
    <BaseFormatButtonGroup 
      editor={editor} 
      currentColor={currentColor} 
      size="xs" 
    />
  );
};

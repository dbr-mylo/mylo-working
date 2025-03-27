
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseListButtonGroup } from '../base/BaseListButtonGroup';
import { useIsWriter } from '@/utils/roles';

interface WriterListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const WriterListButtonGroup: React.FC<WriterListButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  const isWriter = useIsWriter();
  
  // Check if this component is used in the correct role context
  if (!isWriter) {
    console.warn("WriterListButtonGroup used outside of writer role context");
    return null;
  }
  
  return (
    <BaseListButtonGroup 
      editor={editor} 
      currentColor={currentColor} 
      size="xs" 
    />
  );
};

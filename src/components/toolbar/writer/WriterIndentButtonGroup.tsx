
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseIndentButtonGroup } from '../base/BaseIndentButtonGroup';
import { useIsWriter } from '@/utils/roles';

interface WriterIndentButtonGroupProps {
  editor: Editor;
}

export const WriterIndentButtonGroup: React.FC<WriterIndentButtonGroupProps> = ({
  editor
}) => {
  const isWriter = useIsWriter();
  
  // Check if this component is used in the correct role context
  if (!isWriter) {
    console.warn("WriterIndentButtonGroup used outside of writer role context");
    return null;
  }
  
  return (
    <BaseIndentButtonGroup editor={editor} size="xs" />
  );
};

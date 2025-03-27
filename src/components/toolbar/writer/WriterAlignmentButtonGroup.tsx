
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseAlignmentButtonGroup } from '../base/BaseAlignmentButtonGroup';
import { useIsWriter } from '@/utils/roles';

interface WriterAlignmentButtonGroupProps {
  editor: Editor;
}

export const WriterAlignmentButtonGroup: React.FC<WriterAlignmentButtonGroupProps> = ({
  editor
}) => {
  const isWriter = useIsWriter();
  
  // Check if this component is used in the correct role context
  if (!isWriter) {
    console.warn("WriterAlignmentButtonGroup used outside of writer role context");
    return null;
  }
  
  return (
    <BaseAlignmentButtonGroup editor={editor} size="xs" />
  );
};

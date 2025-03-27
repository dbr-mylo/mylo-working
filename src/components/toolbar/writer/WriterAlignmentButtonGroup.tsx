
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseAlignmentButtonGroup } from '../base/BaseAlignmentButtonGroup';

interface WriterAlignmentButtonGroupProps {
  editor: Editor;
}

export const WriterAlignmentButtonGroup: React.FC<WriterAlignmentButtonGroupProps> = ({
  editor
}) => {
  // Remove redundant role checking since parent component already does this
  return (
    <BaseAlignmentButtonGroup editor={editor} size="xs" />
  );
};

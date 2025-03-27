
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseIndentButtonGroup } from '../base/BaseIndentButtonGroup';

interface WriterIndentButtonGroupProps {
  editor: Editor;
}

export const WriterIndentButtonGroup: React.FC<WriterIndentButtonGroupProps> = ({
  editor
}) => {
  // Remove redundant role checking since parent component already does this
  return (
    <BaseIndentButtonGroup editor={editor} size="xs" />
  );
};

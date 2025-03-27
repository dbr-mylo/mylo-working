
import React from 'react';
import { Editor } from '@tiptap/react';
import { IndentButton, OutdentButton } from './BaseIndentButton';

interface BaseIndentButtonGroupProps {
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}

export const BaseIndentButtonGroup: React.FC<BaseIndentButtonGroupProps> = ({
  editor,
  size
}) => {
  return (
    <div className="flex items-center gap-1">
      <IndentButton editor={editor} size={size} />
      <OutdentButton editor={editor} size={size} />
    </div>
  );
};

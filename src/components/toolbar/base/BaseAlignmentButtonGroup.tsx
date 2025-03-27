
import React from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeftButton, AlignCenterButton, AlignRightButton } from './BaseAlignmentButton';

interface BaseAlignmentButtonGroupProps {
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}

export const BaseAlignmentButtonGroup: React.FC<BaseAlignmentButtonGroupProps> = ({
  editor,
  size
}) => {
  return (
    <div className="flex items-center gap-1">
      <AlignLeftButton editor={editor} size={size} />
      <AlignCenterButton editor={editor} size={size} />
      <AlignRightButton editor={editor} size={size} />
    </div>
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { StyleDropdown } from '../StyleDropdown';

interface StyleControlsProps {
  editor: Editor;
}

export const StyleControls: React.FC<StyleControlsProps> = ({ editor }) => {
  return (
    <StyleDropdown editor={editor} />
  );
};

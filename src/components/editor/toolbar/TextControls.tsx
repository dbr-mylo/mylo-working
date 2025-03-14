
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSelect } from '../FontSelect';
import { ColorPicker } from '../ColorPicker';

interface TextControlsProps {
  editor: Editor;
}

export const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <FontSelect editor={editor} />
      <ColorPicker editor={editor} />
    </div>
  );
};

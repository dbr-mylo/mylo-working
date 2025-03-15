
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSelect } from '../FontSelect';
import { ColorPicker } from '../ColorPicker';
import { EditorFontSizeControl } from './EditorFontSizeControl';

interface TextControlsProps {
  editor: Editor;
}

export const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <FontSelect editor={editor} />
      <EditorFontSizeControl editor={editor} className="ml-1" />
      <ColorPicker editor={editor} className="ml-1" />
    </div>
  );
};

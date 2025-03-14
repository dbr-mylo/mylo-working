
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSelect } from '../FontSelect';
import { ColorPicker } from '../ColorPicker';
import { DesignerFontSizeControls } from './DesignerFontSizeControls';

interface TextControlsProps {
  editor: Editor;
}

export const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <FontSelect editor={editor} />
      <ColorPicker editor={editor} />
      <DesignerFontSizeControls editor={editor} className="ml-1 mr-1" />
    </div>
  );
};

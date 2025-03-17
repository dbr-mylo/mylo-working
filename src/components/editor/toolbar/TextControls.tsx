
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSelect } from '../FontSelect';
import { ColorPicker } from '../ColorPicker';
import { EditorFontSizeControl } from './EditorFontSizeControl';
import { Separator } from '@/components/ui/separator';
import { StyleControls } from '@/components/rich-text/toolbar/StyleControls';

interface TextControlsProps {
  editor: Editor;
}

export const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <FontSelect editor={editor} />
      <EditorFontSizeControl editor={editor} className="ml-1" />
      <div className="ml-1">
        <ColorPicker editor={editor} />
      </div>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <StyleControls editor={editor} />
    </div>
  );
};

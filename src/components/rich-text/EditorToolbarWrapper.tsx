
import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorToolbar } from './EditorToolbar';

interface EditorToolbarWrapperProps {
  editor: Editor | null;
  hideToolbar: boolean;
  fixedToolbar: boolean;
  externalToolbar: boolean;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const EditorToolbarWrapper: React.FC<EditorToolbarWrapperProps> = ({
  editor,
  hideToolbar,
  fixedToolbar,
  externalToolbar,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  if (hideToolbar || externalToolbar || !editor) {
    return null;
  }

  return (
    <div className={`editor-toolbar ${fixedToolbar ? 'fixed-toolbar' : ''} py-1.5`}>
      <EditorToolbar 
        editor={editor}
        currentFont={currentFont}
        currentColor={currentColor}
        onFontChange={onFontChange}
        onColorChange={onColorChange}
      />
    </div>
  );
};

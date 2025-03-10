
import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorToolbarContent } from './toolbar/EditorToolbarContent';
import { useToolbarInitialization } from './toolbar/hooks/useToolbarInitialization';

interface EditorToolbarProps {
  editor: Editor | null;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  // Initialize toolbar and clear caches
  useToolbarInitialization();

  // Early return if editor is not available
  if (!editor) {
    return null;
  }

  return (
    <EditorToolbarContent
      editor={editor}
      currentFont={currentFont}
      currentColor={currentColor}
      onFontChange={onFontChange}
      onColorChange={onColorChange}
    />
  );
};

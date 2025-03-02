
import { EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './rich-text/EditorToolbar';
import { EditorStyles } from './rich-text/EditorStyles';
import { useEditorSetup } from './rich-text/useEditor';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false 
}: RichTextEditorProps) => {
  const {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  } = useEditorSetup({ content, onUpdate, isEditable });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <EditorStyles />
      {!hideToolbar && (
        <EditorToolbar 
          editor={editor}
          currentFont={currentFont}
          currentColor={currentColor}
          onFontChange={handleFontChange}
          onColorChange={handleColorChange}
        />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

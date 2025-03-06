
import { EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './rich-text/EditorToolbar';
import { EditorStyles } from './rich-text/EditorStyles';
import { useEditorSetup } from './rich-text/useEditor';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const { role } = useAuth();
  const isDesigner = role === "designer";

  if (!editor) {
    return null;
  }

  return (
    <div className={`prose prose-sm max-w-none ${isDesigner ? 'designer-editor' : ''}`}>
      <EditorStyles />
      <style>
        {`
          /* Add specific styles for designer role editor */
          .designer-editor .ProseMirror {
            min-height: 11in;
            width: 8.5in;
            padding: 1in;
            margin: 0 auto;
            background-color: white;
          }
        `}
      </style>
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

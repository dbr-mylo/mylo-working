
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
  fixedToolbar?: boolean;
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false,
  fixedToolbar = false
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
          
          /* Fixed toolbar styles */
          .fixed-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: white;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          /* Remove top margin for designer role toolbar */
          .designer-editor .fixed-toolbar {
            margin-top: 0;
            padding-top: 0;
          }
        `}
      </style>
      {!hideToolbar && (
        <div className={fixedToolbar ? 'fixed-toolbar' : ''}>
          <EditorToolbar 
            editor={editor}
            currentFont={currentFont}
            currentColor={currentColor}
            onFontChange={handleFontChange}
            onColorChange={handleColorChange}
          />
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

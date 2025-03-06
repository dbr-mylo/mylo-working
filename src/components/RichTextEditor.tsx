
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

  // Add this effect to make the editor instance available globally
  useEffect(() => {
    if (editor) {
      // Wait for the DOM to be updated
      setTimeout(() => {
        const editorElement = document.querySelector('.ProseMirror');
        if (editorElement) {
          // Use a type assertion to add the custom property
          (editorElement as any).tiptapEditor = editor;
        }
      }, 0);
    }
    
    return () => {
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        // Type assertion to remove the custom property
        delete (editorElement as any).tiptapEditor;
      }
    };
  }, [editor]);

  // Always show at least a loading indicator when editor is initializing
  if (!editor) {
    return <div className="flex items-center justify-center p-4 h-[11in] w-[8.5in] mx-auto bg-white">
      <p className="text-gray-400">Editor is loading...</p>
    </div>;
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
            padding: 0;
            margin: 0;
            width: 8.5in;
            margin-left: auto;
            margin-right: auto;
          }
          
          /* Ensure ProseMirror is always visible */
          .ProseMirror {
            display: block !important;
            visibility: visible !important;
            min-height: 11in;
            background-color: white;
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
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

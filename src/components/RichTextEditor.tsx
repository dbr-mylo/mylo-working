
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
  renderToolbarOutside?: boolean;
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false,
  fixedToolbar = false,
  renderToolbarOutside = false
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

  // Log editor state for debugging
  useEffect(() => {
    if (editor) {
      console.log('Editor initialized in RichTextEditor');
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const renderToolbar = () => (
    <EditorToolbar 
      editor={editor}
      currentFont={currentFont}
      currentColor={currentColor}
      onFontChange={handleFontChange}
      onColorChange={handleColorChange}
    />
  );

  return (
    <div className={`prose prose-sm max-w-none ${isDesigner ? 'designer-editor' : ''}`}>
      <EditorStyles />
      <style jsx global>{`
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
          ${!isDesigner ? 'border-bottom: 1px solid #e2e8f0;' : ''}
          padding: 0;
          margin: 0;
          width: 8.5in;
          margin-left: auto;
          margin-right: auto;
        }

        /* Ensure the ProseMirror editor is visible and focused */
        .ProseMirror {
          outline: none !important;
          min-height: 6rem;
        }

        /* Better list styling */
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em !important;
        }
      `}</style>
      {!hideToolbar && !renderToolbarOutside && (
        <div className={fixedToolbar ? 'fixed-toolbar' : ''}>
          {renderToolbar()}
        </div>
      )}
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};


import { EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './rich-text/EditorToolbar';
import { EditorStyles } from './rich-text/EditorStyles';
import { useEditorSetup } from './rich-text/useEditor';
import { useAuth } from '@/contexts/AuthContext';
import { Editor } from '@tiptap/react';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
  fixedToolbar?: boolean;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  externalEditorInstance?: Editor | null; // New prop for external editor instance
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false,
  fixedToolbar = false,
  renderToolbarOutside = false,
  externalToolbar = false,
  externalEditorInstance = null // Default to null
}: RichTextEditorProps) => {
  
  // Use external editor if provided, otherwise create a new one
  const useOwnEditor = !externalEditorInstance;
  
  const editorSetup = useOwnEditor 
    ? useEditorSetup({ content, onUpdate, isEditable })
    : null;
  
  // Use either the external editor or our own
  const editor = externalEditorInstance || (editorSetup?.editor);
  
  const { role } = useAuth();
  const isDesigner = role === "designer";

  if (!editor) {
    return null;
  }

  const renderToolbar = () => {
    if (externalEditorInstance) {
      return null; // Don't render toolbar if using external editor instance
    }
    
    if (!editorSetup) return null;
    
    return (
      <EditorToolbar 
        editor={editorSetup.editor}
        currentFont={editorSetup.currentFont}
        currentColor={editorSetup.currentColor}
        onFontChange={editorSetup.handleFontChange}
        onColorChange={editorSetup.handleColorChange}
      />
    );
  };

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
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        
        /* Fixed toolbar styles */
        .editor-toolbar {
          background-color: white;
          ${!isDesigner ? 'border-bottom: 1px solid #e2e8f0;' : ''}
          padding: 0;
          margin: 0;
          z-index: 10;
        }
        
        .fixed-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          width: 100%;
        }
      `}</style>
      
      {!hideToolbar && !externalToolbar && (
        <div className={`editor-toolbar ${fixedToolbar ? 'fixed-toolbar' : ''}`}>
          {renderToolbar()}
        </div>
      )}
      
      <EditorContent editor={editor} />
    </div>
  );
};


import { EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './rich-text/EditorToolbar';
import { EditorStyles } from './rich-text/styles';
import { useEditorSetup } from './rich-text/useEditor';
import { useAuth } from '@/contexts/AuthContext';
import { Editor } from '@tiptap/react';
import { textStyleStore } from '@/stores/textStyles';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
  fixedToolbar?: boolean;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  externalEditorInstance?: Editor | null;
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false,
  fixedToolbar = false,
  renderToolbarOutside = false,
  externalToolbar = false,
  externalEditorInstance = null
}: RichTextEditorProps) => {
  
  useEffect(() => {
    console.log("RichTextEditor: Clearing cache and resetting styles on mount");
    // Clear font size cache
    localStorage.removeItem('editor_font_size');
    sessionStorage.removeItem('editor_font_size');
    
    // Clear text style caches
    textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
    textStyleStore.clearEditorCache();
    
    // Clean up any previous events
    const cleanupEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(cleanupEvent);
  }, []);
  
  const useOwnEditor = !externalEditorInstance;
  
  const editorSetup = useOwnEditor 
    ? useEditorSetup({ 
        content, 
        onContentChange: onUpdate,
        isEditable 
      })
    : null;
  
  const editor = externalEditorInstance || (editorSetup?.editor);
  
  const { role } = useAuth();
  const isDesigner = role === "designer";

  useEffect(() => {
    if (editor && isEditable) {
      console.log("Editor initialized with content:", content.substring(0, 100));
      
      // After editor is mounted, scan for any font sizes in the content
      setTimeout(() => {
        if (editor) {
          console.log("Initial editor HTML:", editor.getHTML().substring(0, 100));
          
          // Force editor to update font size if needed
          try {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              if (range) {
                const fontSizeEvent = new CustomEvent('tiptap-clear-font-cache');
                document.dispatchEvent(fontSizeEvent);
              }
            }
          } catch (e) {
            console.error("Error handling editor initialization:", e);
          }
        }
      }, 100);
    }
  }, [editor, content, isEditable]);

  if (!editor) {
    return null;
  }

  const renderToolbar = () => {
    if (externalEditorInstance) {
      return null;
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
    <div className={`prose prose-sm max-w-none font-editor ${isDesigner ? 'designer-editor' : ''}`}>
      <EditorStyles />
      <style>
        {`
        .designer-editor .ProseMirror {
          min-height: 11in;
          width: 8.5in;
          padding: 1in;
          margin: 0 auto;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        
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
        `}
      </style>
      
      {!hideToolbar && !externalToolbar && (
        <div className={`editor-toolbar ${fixedToolbar ? 'fixed-toolbar' : ''}`}>
          {renderToolbar()}
        </div>
      )}
      
      <EditorContent editor={editor} className="font-editor" />
    </div>
  );
};


import { EditorContent } from '@tiptap/react';
import { useState, useEffect, useRef } from 'react';
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
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
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

  // Fix font size discrepancy by checking DOM directly on initialization
  useEffect(() => {
    if (!editor || !isEditable) return;
    
    const initialSizeCheck = () => {
      try {
        if (editorContainerRef.current) {
          // First check if we have explicit font-size styles
          const elements = editorContainerRef.current.querySelectorAll('[style*="font-size"]');
          
          if (elements.length > 0) {
            // Found explicit font sizes, use the first one as reference
            const element = elements[0] as HTMLElement;
            const fontSize = element.style.fontSize;
            console.log("RichTextEditor: Found element with explicit font-size:", fontSize);
            
            // Broadcast this size to synchronize toolbar
            const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
              detail: { fontSize, source: 'dom-init' }
            });
            document.dispatchEvent(fontSizeEvent);
            
            // Apply it to editor for consistency
            setTimeout(() => {
              if (editor && editor.isActive) {
                editor.commands.setFontSize(fontSize);
              }
            }, 50);
          } else {
            // No explicit styles found, check default paragraph
            const paragraphs = editorContainerRef.current.querySelectorAll('p');
            if (paragraphs.length > 0) {
              const computedStyle = window.getComputedStyle(paragraphs[0]);
              const fontSize = computedStyle.fontSize;
              console.log("RichTextEditor: No explicit style, using computed style:", fontSize);
              
              // Broadcast this computed size
              const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                detail: { fontSize, source: 'dom-computed' }
              });
              document.dispatchEvent(fontSizeEvent);
            } else {
              console.log("RichTextEditor: No paragraphs found to check font size");
            }
          }
        }
      } catch (error) {
        console.error("Error checking initial font size:", error);
      }
    };
    
    // Run after editor is mounted and content is loaded
    const timeoutId = setTimeout(() => {
      initialSizeCheck();
      
      // Force one more refresh to ensure consistency
      const fontSizeEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(fontSizeEvent);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [editor, isEditable, content]);

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
    <div 
      className={`prose prose-sm max-w-none font-editor ${isDesigner ? 'designer-editor' : ''}`}
      ref={editorContainerRef}
    >
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

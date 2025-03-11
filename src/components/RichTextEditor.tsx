
import { EditorContent } from '@tiptap/react';
import { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { useEditorSetup } from './rich-text/useEditor';
import { EditorStyles } from './rich-text/styles';
import { EditorContainer } from './rich-text/EditorContainer';
import { EditorInitializer } from './rich-text/EditorInitializer';
import { FontSizeInitializer } from './rich-text/FontSizeInitializer';
import { EditorToolbarWrapper } from './rich-text/EditorToolbarWrapper';

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
  
  // Initialize editor or use external instance
  const useOwnEditor = !externalEditorInstance;
  
  const editorSetup = useOwnEditor 
    ? useEditorSetup({ 
        content, 
        onContentChange: onUpdate,
        isEditable 
      })
    : null;
  
  const editor = externalEditorInstance || (editorSetup?.editor);

  // Early return if editor is not available
  if (!editor) {
    return null;
  }

  return (
    <EditorContainer 
      fixedToolbar={fixedToolbar}
      refProp={editorContainerRef}
    >
      {/* Initialize editor and clear caches */}
      <EditorInitializer />
      
      {/* Add necessary styles */}
      <EditorStyles />
      
      {/* Handle font size initialization */}
      <FontSizeInitializer 
        editor={editor}
        isEditable={isEditable}
        editorContainerRef={editorContainerRef}
        content={content}
      />
      
      {/* Conditionally render toolbar */}
      {!externalEditorInstance && editorSetup && (
        <EditorToolbarWrapper 
          editor={editorSetup.editor}
          hideToolbar={hideToolbar}
          fixedToolbar={fixedToolbar}
          externalToolbar={externalToolbar}
          currentFont={editorSetup.currentFont}
          currentColor={editorSetup.currentColor}
          onFontChange={editorSetup.handleFontChange}
          onColorChange={editorSetup.handleColorChange}
        />
      )}
      
      {/* Editor content */}
      <EditorContent editor={editor} className="font-editor" />
    </EditorContainer>
  );
};

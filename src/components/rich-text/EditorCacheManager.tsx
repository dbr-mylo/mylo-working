
import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorStyles } from './styles';
import { EditorInitializer } from './EditorInitializer';
import { FontSizeInitializer } from './FontSizeInitializer';

interface EditorCacheManagerProps {
  editor: Editor;
  isEditable: boolean;
  editorContainerRef: React.RefObject<HTMLDivElement>;
  content: string;
}

export const EditorCacheManager: React.FC<EditorCacheManagerProps> = ({ 
  editor, 
  isEditable, 
  editorContainerRef,
  content
}) => {
  return (
    <>
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
    </>
  );
};

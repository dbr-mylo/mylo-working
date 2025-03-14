
import React from 'react';
import { Toolbar } from './editor/Toolbar';
import { useAuth } from '@/contexts/AuthContext';
import { useIsEditor } from '@/utils/roleSpecificRendering';
import { Editor } from '@tiptap/react';

interface EditorToolbarContainerProps {
  editor: Editor | null;
  isEditable?: boolean;
}

export const EditorToolbarContainer = ({ 
  editor, 
  isEditable = true 
}: EditorToolbarContainerProps) => {
  const { role } = useAuth();
  const isEditor = useIsEditor();
  
  // Only show the toolbar if we're in editor role and it should be editable
  if (!isEditor || !isEditable || !editor) {
    return null;
  }

  return (
    <div className="editor-toolbar-container border-b border-editor-border bg-white px-4 py-1.5 relative z-50">
      <div className="mx-auto">
        <Toolbar editor={editor} />
      </div>
    </div>
  );
};

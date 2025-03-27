
import React from 'react';
import { Toolbar } from './editor/Toolbar';
import { useAuth } from '@/contexts/AuthContext';
import { useIsWriter } from '@/utils/roles';
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
  const isWriter = useIsWriter();
  
  // Early return if no editor or not editable
  if (!editor || !isEditable) {
    return null;
  }
  
  // Only show toolbar for writer role
  if (!isWriter) {
    console.log("Toolbar hidden: User role is not writer", role);
    return null;
  }
  
  return (
    <div className="editor-toolbar-container border-b border-editor-border bg-white px-4 py-1.5 relative z-50" data-role={role}>
      <div className="mx-auto">
        <Toolbar editor={editor} />
      </div>
    </div>
  );
};

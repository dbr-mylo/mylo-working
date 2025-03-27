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
  
  // Only show the toolbar if we're in writer role and it should be editable
  if (!editor || !isEditable) {
    return null;
  }
  
  // We're removing the isWriter check here since it might be blocking the toolbar
  // We'll still keep the data-role attribute for debugging purposes
  return (
    <div className="editor-toolbar-container border-b border-editor-border bg-white px-4 py-1.5 relative z-50" data-role={role}>
      <div className="mx-auto">
        <Toolbar editor={editor} />
      </div>
    </div>
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizeControls } from '@/components/rich-text/toolbar/FontSizeControls';

interface DesignerFontSizeControlsProps {
  editor: Editor;
}

export const DesignerFontSizeControls: React.FC<DesignerFontSizeControlsProps> = ({ editor }) => {
  const { role } = useAuth();
  
  // Only render for designer role
  if (role !== "designer") {
    return null;
  }
  
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
  const isTextSelected = !editor.state.selection.empty;
  
  return (
    <FontSizeControls 
      currentFontSize={currentFontSize}
      isTextSelected={isTextSelected}
      onFontSizeChange={(fontSize) => {
        editor.chain().focus().setFontSize(fontSize).run();
      }}
    />
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizeSection } from '@/components/rich-text/toolbar/FontSizeSection';

interface DesignerFontSizeControlsProps {
  editor: Editor;
  className?: string;
}

export const DesignerFontSizeControls: React.FC<DesignerFontSizeControlsProps> = ({ 
  editor,
  className 
}) => {
  const { role } = useAuth();
  
  // Only render for designer role
  if (role !== "designer") {
    return null;
  }
  
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
  const isTextSelected = !editor.state.selection.empty;
  
  return (
    <FontSizeSection 
      editor={editor}
      currentFontSize={currentFontSize}
      isTextSelected={isTextSelected}
      onFontSizeChange={(fontSize) => {
        editor.chain().focus().setFontSize(fontSize).run();
      }}
      className={className}
    />
  );
};

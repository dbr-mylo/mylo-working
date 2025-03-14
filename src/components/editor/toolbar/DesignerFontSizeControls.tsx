
import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizeInput } from '@/components/rich-text/font-size';

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
  
  return (
    <FontSizeInput 
      value={currentFontSize} 
      onChange={(fontSize) => {
        editor.chain().focus().setFontSize(fontSize).run();
      }}
      className="ml-1 mr-1"
    />
  );
};

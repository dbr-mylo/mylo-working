
import React from 'react';
import { Editor } from '@tiptap/react';
import { StyleDropdown } from '@/components/rich-text/StyleDropdown';
import { useIsDesigner } from '@/utils/roles';

interface DesignerStyleControlsProps {
  editor: Editor;
}

export const DesignerStyleControls: React.FC<DesignerStyleControlsProps> = ({ editor }) => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerStyleControls used outside of designer role context");
    return null;
  }
  
  return (
    <StyleDropdown editor={editor} />
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseFormatButtonGroup } from '../base/BaseFormatButtonGroup';
import { useIsDesigner } from '@/utils/roles';

interface DesignerFormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const DesignerFormatButtonGroup: React.FC<DesignerFormatButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  const isDesigner = useIsDesigner();
  
  // Check if this component is used in the correct role context
  if (!isDesigner) {
    console.warn("DesignerFormatButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <BaseFormatButtonGroup 
      editor={editor} 
      currentColor={currentColor}
      size="xxs"
    />
  );
};

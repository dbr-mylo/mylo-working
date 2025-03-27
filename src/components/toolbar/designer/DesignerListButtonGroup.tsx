
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseListButtonGroup } from '../base/BaseListButtonGroup';
import { useIsDesigner } from '@/utils/roles';

interface DesignerListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const DesignerListButtonGroup: React.FC<DesignerListButtonGroupProps> = ({
  editor,
  currentColor
}) => {
  const isDesigner = useIsDesigner();
  
  // Check if this component is used in the correct role context
  if (!isDesigner) {
    console.warn("DesignerListButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <BaseListButtonGroup 
      editor={editor} 
      currentColor={currentColor}
      size="xxs"
    />
  );
};

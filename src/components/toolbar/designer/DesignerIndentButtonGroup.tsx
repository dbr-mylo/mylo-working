
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseIndentButtonGroup } from '../base/BaseIndentButtonGroup';
import { useIsDesigner } from '@/utils/roles';

interface DesignerIndentButtonGroupProps {
  editor: Editor;
}

export const DesignerIndentButtonGroup: React.FC<DesignerIndentButtonGroupProps> = ({
  editor
}) => {
  const isDesigner = useIsDesigner();
  
  // Check if this component is used in the correct role context
  if (!isDesigner) {
    console.warn("DesignerIndentButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <BaseIndentButtonGroup editor={editor} size="xxs" />
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseAlignmentButtonGroup } from '../base/BaseAlignmentButtonGroup';
import { useIsDesigner } from '@/utils/roles';

interface DesignerAlignmentButtonGroupProps {
  editor: Editor;
}

export const DesignerAlignmentButtonGroup: React.FC<DesignerAlignmentButtonGroupProps> = ({
  editor
}) => {
  const isDesigner = useIsDesigner();
  
  // Check if this component is used in the correct role context
  if (!isDesigner) {
    console.warn("DesignerAlignmentButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <BaseAlignmentButtonGroup editor={editor} size="xxs" />
  );
};

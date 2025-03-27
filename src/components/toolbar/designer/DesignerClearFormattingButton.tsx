
import React from 'react';
import { Editor } from '@tiptap/react';
import { BaseClearFormattingButton } from '../base/BaseClearFormattingButton';
import { useIsDesigner } from '@/utils/roles';

interface DesignerClearFormattingButtonProps {
  editor: Editor;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const DesignerClearFormattingButton: React.FC<DesignerClearFormattingButtonProps> = ({
  editor,
  onFontChange,
  onColorChange
}) => {
  const isDesigner = useIsDesigner();
  
  // Check if this component is used in the correct role context
  if (!isDesigner) {
    console.warn("DesignerClearFormattingButton used outside of designer role context");
    return null;
  }
  
  return (
    <BaseClearFormattingButton 
      editor={editor} 
      onFontChange={onFontChange}
      onColorChange={onColorChange}
      size="xxs"
      showLabel={false}
    />
  );
};

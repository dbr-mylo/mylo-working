
import React from 'react';
import { Editor } from '@tiptap/react';
import { BoldButton, ItalicButton } from './BaseFormatButton';

interface BaseFormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}

export const BaseFormatButtonGroup: React.FC<BaseFormatButtonGroupProps> = ({
  editor,
  currentColor,
  size
}) => {
  return (
    <div className="flex items-center gap-1">
      <BoldButton 
        editor={editor} 
        currentColor={currentColor} 
        size={size} 
      />
      <ItalicButton 
        editor={editor} 
        currentColor={currentColor} 
        size={size} 
      />
    </div>
  );
};

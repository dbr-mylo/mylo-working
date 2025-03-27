
import React from 'react';
import { Editor } from '@tiptap/react';
import { BulletListButton, OrderedListButton } from './BaseListButton';

interface BaseListButtonGroupProps {
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}

export const BaseListButtonGroup: React.FC<BaseListButtonGroupProps> = ({
  editor,
  currentColor,
  size
}) => {
  return (
    <div className="flex items-center gap-1">
      <BulletListButton 
        editor={editor} 
        currentColor={currentColor} 
        size={size} 
      />
      <OrderedListButton 
        editor={editor} 
        currentColor={currentColor} 
        size={size} 
      />
    </div>
  );
};

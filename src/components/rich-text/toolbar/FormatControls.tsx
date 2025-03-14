
import React from 'react';
import { Editor } from '@tiptap/react';
import { FormatButtons } from './FormatButtons';
import { IndentButtons } from './IndentButtons';
import { Separator } from '@/components/ui/separator';

interface FormatControlsProps {
  editor: Editor;
  currentColor: string;
  buttonSize: "default" | "sm" | "xs" | "xxs" | "lg" | "icon" | null | undefined;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  editor,
  currentColor,
  buttonSize
}) => {
  return (
    <>
      <FormatButtons 
        editor={editor}
        currentColor={currentColor}
        buttonSize={buttonSize}
      />
      
      <IndentButtons 
        editor={editor}
        buttonSize={buttonSize}
      />
    </>
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextAlignButtonsProps {
  editor: Editor;
  buttonSize: "default" | "sm" | "xs" | "xxs" | "lg" | "icon" | null | undefined;
}

export const TextAlignButtons: React.FC<TextAlignButtonsProps> = ({ 
  editor, 
  buttonSize 
}) => {
  return (
    <>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        title="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        title="Align center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        title="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
        title="Justify text"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </>
  );
};


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
  // Helper function to set text alignment
  const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    return () => editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={setTextAlign('left')}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        title="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={setTextAlign('center')}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        title="Align center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={setTextAlign('right')}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        title="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={setTextAlign('justify')}
        className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
        title="Justify text"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </>
  );
};

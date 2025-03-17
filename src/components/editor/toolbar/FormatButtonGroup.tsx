
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '../../rich-text/utils/colorPreservation';

interface FormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const FormatButtonGroup: React.FC<FormatButtonGroupProps> = ({ editor, currentColor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xs"
        onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`border-0 p-1 ${editor.isActive('bold') ? 'bg-accent' : 'hover:bg-accent/50'}`}
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => {
          preserveColorAfterFormatting(editor, () => {
            editor.chain().focus().toggleItalic().run();
          }, currentColor);
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`border-0 p-1 ${editor.isActive('italic') ? 'bg-accent' : 'hover:bg-accent/50'}`}
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

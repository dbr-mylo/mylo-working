
import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting } from '../../rich-text/utils/colorPreservation';

interface ListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const ListButtonGroup: React.FC<ListButtonGroupProps> = ({ editor, currentColor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xs"
        onClick={() => preserveColorAfterFormatting(
          editor, 
          () => editor.chain().focus().toggleBulletList().run(), 
          currentColor
        )}
        className={`border-0 p-1 ${editor.isActive('bulletList') ? 'bg-accent' : 'hover:bg-accent/50'}`}
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => preserveColorAfterFormatting(
          editor, 
          () => editor.chain().focus().toggleOrderedList().run(), 
          currentColor
        )}
        className={`border-0 p-1 ${editor.isActive('orderedList') ? 'bg-accent' : 'hover:bg-accent/50'}`}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

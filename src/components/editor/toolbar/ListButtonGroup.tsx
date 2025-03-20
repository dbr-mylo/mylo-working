
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
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="xs"
        onClick={() => preserveColorAfterFormatting(
          editor, 
          () => editor.chain().focus().toggleBulletList().run(), 
          currentColor
        )}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
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
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

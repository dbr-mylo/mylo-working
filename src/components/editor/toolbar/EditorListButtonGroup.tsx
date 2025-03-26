
import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting } from '../../rich-text/utils/colorPreservation';
import { useIsWriter } from '@/utils/roles';

interface EditorListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const EditorListButtonGroup: React.FC<EditorListButtonGroupProps> = ({ editor, currentColor }) => {
  // Make sure this component is only used in writer role
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("EditorListButtonGroup used outside of writer role context");
    return null;
  }
  
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
        aria-label="Bullet List"
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
        aria-label="Ordered List"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

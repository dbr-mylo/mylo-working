
import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting } from '@/components/rich-text/utils/colorPreservation';
import { useIsDesigner } from '@/utils/roles';

interface DesignerListButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const DesignerListButtonGroup: React.FC<DesignerListButtonGroupProps> = ({ 
  editor, 
  currentColor 
}) => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerListButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xxs"
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
        size="xxs"
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

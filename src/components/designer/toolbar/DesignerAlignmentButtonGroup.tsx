
import React from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsDesigner } from '@/utils/roles';

interface DesignerAlignmentButtonGroupProps {
  editor: Editor;
}

export const DesignerAlignmentButtonGroup: React.FC<DesignerAlignmentButtonGroupProps> = ({ editor }) => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerAlignmentButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xxs"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xxs"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xxs"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

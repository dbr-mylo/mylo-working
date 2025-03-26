
import React from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsWriter } from '@/utils/roles';

interface EditorAlignmentButtonGroupProps {
  editor: Editor;
}

export const EditorAlignmentButtonGroup: React.FC<EditorAlignmentButtonGroupProps> = ({ editor }) => {
  // Make sure this component is only used in writer role
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("EditorAlignmentButtonGroup used outside of writer role context");
    return null;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xs"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`border-0 p-1 ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Align Right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

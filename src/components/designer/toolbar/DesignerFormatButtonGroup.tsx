
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '@/components/rich-text/utils/colorPreservation';
import { useIsDesigner } from '@/utils/roles';

interface DesignerFormatButtonGroupProps {
  editor: Editor;
  currentColor: string;
}

export const DesignerFormatButtonGroup: React.FC<DesignerFormatButtonGroupProps> = ({ 
  editor, 
  currentColor 
}) => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerFormatButtonGroup used outside of designer role context");
    return null;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xxs"
        onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`border-0 p-1 ${editor.isActive('bold') ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xxs"
        onClick={() => {
          preserveColorAfterFormatting(editor, () => {
            editor.chain().focus().toggleItalic().run();
          }, currentColor);
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`border-0 p-1 ${editor.isActive('italic') ? 'bg-accent' : 'hover:bg-accent/50'}`}
        aria-label="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

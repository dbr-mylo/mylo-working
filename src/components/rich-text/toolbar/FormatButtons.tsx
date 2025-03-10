
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '../utils/colorPreservation';
import { useToast } from '@/hooks/use-toast';

interface FormatButtonsProps {
  editor: Editor;
  currentColor: string;
  buttonSize: "default" | "sm" | "xs" | "xxs" | "lg" | "icon" | null | undefined;
}

export const FormatButtons: React.FC<FormatButtonsProps> = ({ 
  editor, 
  currentColor,
  buttonSize 
}) => {
  const { toast } = useToast();

  const clearFormatting = () => {
    if (!editor) return;
    
    // First unset all marks
    editor.chain()
      .focus()
      .unsetAllMarks()
      .run();
    
    // Then reset to default paragraph
    editor.chain()
      .focus()
      .setParagraph()
      .run();
    
    // Explicitly set font to Inter
    editor.chain()
      .focus()
      .setFontFamily('Inter')
      .setFontSize('16px')
      .setColor('#000000')
      .run();
    
    // Force selection refresh to update toolbar state
    const currentSelection = editor.state.selection;
    editor.commands.setTextSelection({
      from: currentSelection.from,
      to: currentSelection.to
    });
    
    // Show success toast
    toast({
      title: "Default style applied",
      description: "Text has been reset to default formatting"
    });
    
    console.log("After clearing formatting, font family:", editor.getAttributes('textStyle').fontFamily);
  };

  return (
    <>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => {
          preserveColorAfterFormatting(editor, () => {
            editor.chain().focus().toggleItalic().run();
          }, currentColor);
        }}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => preserveColorAfterFormatting(
          editor, 
          () => editor.chain().focus().toggleBulletList().run(), 
          currentColor
        )}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => preserveColorAfterFormatting(
          editor, 
          () => editor.chain().focus().toggleOrderedList().run(), 
          currentColor
        )}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size={buttonSize}
        onClick={clearFormatting}
        title="Clear formatting and apply default style"
      >
        <Eraser className="h-4 w-4" />
      </Button>
    </>
  );
};

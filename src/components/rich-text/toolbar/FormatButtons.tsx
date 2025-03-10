
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '../utils/colorPreservation';
import { textStyleStore } from '@/stores/textStyles';

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
  const clearFormatting = async () => {
    // First get the default style
    try {
      const defaultStyle = await textStyleStore.getDefaultStyle();
      
      // Clear all existing formatting
      editor.chain()
        .focus()
        .unsetAllMarks()
        .setFontFamily(null)
        .setFontSize(null)
        .setColor(null)
        .run();
        
      // If we have a default style, apply it
      if (defaultStyle) {
        // Apply default style properties
        editor.chain()
          .focus()
          .setFontFamily(defaultStyle.fontFamily || 'Inter')
          .setFontSize(defaultStyle.fontSize || '16px')
          .setColor(defaultStyle.color || '#000000')
          .run();
      }
    } catch (error) {
      console.error('Error applying default style after clearing formatting:', error);
      
      // Fallback to basic clearing if getting default style fails
      editor.chain()
        .focus()
        .unsetAllMarks()
        .setFontFamily(null)
        .setFontSize(null)
        .setColor(null)
        .run();
    }
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

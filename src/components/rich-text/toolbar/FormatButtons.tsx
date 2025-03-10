
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, RemoveFormatting, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '../utils/colorPreservation';

interface FormatButtonsProps {
  editor: Editor;
  currentColor: string;
  buttonSize: "default" | "sm" | "xs" | "xxs" | "lg" | "icon" | null | undefined;
}

// Define font size increments in pixels
const fontSizeIncrements = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

export const FormatButtons: React.FC<FormatButtonsProps> = ({ 
  editor, 
  currentColor,
  buttonSize 
}) => {
  const getCurrentFontSize = (): number => {
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      // Extract numeric value from fontSize (e.g., '16px' -> 16)
      const size = parseInt(attrs.fontSize.replace('px', ''));
      return isNaN(size) ? 16 : size; // Default to 16 if parsing fails
    }
    return 16; // Default font size
  };

  const increaseFontSize = () => {
    const currentSize = getCurrentFontSize();
    // Find the next size up
    const nextSize = fontSizeIncrements.find(size => size > currentSize);
    if (nextSize) {
      editor.chain().focus().setFontSize(`${nextSize}px`).run();
    }
  };

  const decreaseFontSize = () => {
    const currentSize = getCurrentFontSize();
    // Find the next size down (reverse search)
    const nextSize = [...fontSizeIncrements].reverse().find(size => size < currentSize);
    if (nextSize) {
      editor.chain().focus().setFontSize(`${nextSize}px`).run();
    }
  };

  const clearFormatting = () => {
    editor.chain().focus()
      .unsetFontSize()
      .unsetBold()
      .unsetItalic()
      .unsetColor()
      .run();
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size={buttonSize}
          onClick={decreaseFontSize}
          title="Decrease font size"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={increaseFontSize}
          title="Increase font size"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

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
        title="Clear formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
    </>
  );
};

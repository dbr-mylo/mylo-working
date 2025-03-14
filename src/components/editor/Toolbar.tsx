
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, RemoveFormatting } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FontSelect } from './FontSelect';
import { ColorPicker } from './ColorPicker';
import { preserveColorAfterFormatting, handleBoldWithColorPreservation } from '../rich-text/utils/colorPreservation';
import { clearFormatting } from '../rich-text/utils/textFormatting';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <div className="border border-border rounded-t-md bg-background p-2 flex flex-wrap gap-2 items-center">
      <FontSelect editor={editor} />
      <ColorPicker editor={editor} />
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            preserveColorAfterFormatting(editor, () => {
              editor.chain().focus().toggleItalic().run();
            }, currentColor);
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
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
          variant="ghost"
          size="sm"
          onClick={() => preserveColorAfterFormatting(
            editor, 
            () => editor.chain().focus().toggleOrderedList().run(), 
            currentColor
          )}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => clearFormatting(editor)}
        title="Clear formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
    </div>
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, RemoveFormatting, Indent, Outdent } from 'lucide-react';
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

  const handleIndent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.min((editor.getAttributes('bulletList').indent || 0) + 1, 10)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.min((editor.getAttributes('orderedList').indent || 0) + 1, 10)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.min((editor.getAttributes('paragraph').indent || 0) + 1, 10)
        }).run();
      }
    }
  };

  const handleOutdent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.max((editor.getAttributes('bulletList').indent || 0) - 1, 0)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.max((editor.getAttributes('orderedList').indent || 0) - 1, 0)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.max((editor.getAttributes('paragraph').indent || 0) - 1, 0)
        }).run();
      }
    }
  };

  return (
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-1 items-center">
      <div className="flex items-center gap-1">
        <FontSelect editor={editor} />
        <ColorPicker editor={editor} />
      </div>
      
      {/* Format buttons group */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            preserveColorAfterFormatting(editor, () => {
              editor.chain().focus().toggleItalic().run();
            }, currentColor);
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* List buttons group */}
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
      
      {/* Alignment buttons group */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {/* Indent/Outdent buttons group */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="xs"
          onClick={handleIndent}
          title="Indent paragraph"
        >
          <Indent className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleOutdent}
          title="Outdent paragraph"
        >
          <Outdent className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {/* Clear formatting button */}
      <Button
        variant="ghost"
        size="xs"
        onClick={() => clearFormatting(editor)}
        title="Clear formatting"
      >
        <RemoveFormatting className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

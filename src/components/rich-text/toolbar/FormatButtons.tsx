
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormatButtonsProps {
  editor: Editor | null;
  currentColor: string;
  handleBoldClick: () => void;
  preserveColorAfterFormatting: (formatCommand: () => void) => void;
  handleIndent: () => void;
  handleOutdent: () => void;
}

export const FormatButtons: React.FC<FormatButtonsProps> = ({
  editor,
  currentColor,
  handleBoldClick,
  preserveColorAfterFormatting,
  handleIndent,
  handleOutdent
}) => {
  if (!editor) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBoldClick}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          preserveColorAfterFormatting(() => {
            editor.chain().focus().toggleItalic().run();
          });
        }}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => preserveColorAfterFormatting(() => editor.chain().focus().toggleBulletList().run())}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => preserveColorAfterFormatting(() => editor.chain().focus().toggleOrderedList().run())}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleIndent}
        title="Indent paragraph"
      >
        <Indent className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOutdent}
        title="Outdent paragraph"
      >
        <Outdent className="h-4 w-4" />
      </Button>
    </>
  );
};

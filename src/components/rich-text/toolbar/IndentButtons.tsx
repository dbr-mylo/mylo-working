
import React from 'react';
import { Editor } from '@tiptap/react';
import { Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IndentButtonsProps {
  editor: Editor;
  buttonSize: "default" | "sm" | "xs" | "xxs" | "lg" | "icon" | null | undefined;
}

export const IndentButtons: React.FC<IndentButtonsProps> = ({ editor, buttonSize }) => {
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
    <div className="flex items-center">
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleIndent}
        title="Indent paragraph"
      >
        <Indent className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleOutdent}
        title="Outdent paragraph"
      >
        <Outdent className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

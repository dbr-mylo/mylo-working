
import React from 'react';
import { Editor } from '@tiptap/react';
import { Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsWriter } from '@/utils/roles';

interface EditorIndentButtonGroupProps {
  editor: Editor;
}

export const EditorIndentButtonGroup: React.FC<EditorIndentButtonGroupProps> = ({ editor }) => {
  // Make sure this component is only used in writer role
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("EditorIndentButtonGroup used outside of writer role context");
    return null;
  }
  
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
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="xs"
        onClick={handleIndent}
        title="Indent paragraph"
        className="border-0 p-1 hover:bg-accent/50"
        aria-label="Indent"
      >
        <Indent className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleOutdent}
        title="Outdent paragraph"
        className="border-0 p-1 hover:bg-accent/50"
        aria-label="Outdent"
      >
        <Outdent className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

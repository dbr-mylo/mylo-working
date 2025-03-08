
import { Editor } from '@tiptap/react';

export const handleIndent = (editor: Editor | null) => {
  if (!editor) return;
  
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
};

export const handleOutdent = (editor: Editor | null) => {
  if (!editor) return;
  
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
};


import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './editor/EditorToolbar';
import { EditorStyles } from './editor/EditorStyles';
import { getEditorExtensions } from './editor/EditorConfig';

export const RichTextEditor = ({ content, onUpdate, isEditable = true, hideToolbar = false }) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && currentFont) {
      editor.chain().focus().setMark('textStyle', { fontFamily: currentFont }).run();
    }
  }, [currentFont, editor]);

  useEffect(() => {
    if (editor && currentColor) {
      editor.chain().focus().setColor(currentColor).run();
    }
  }, [currentColor, editor]);

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    editor?.chain().focus().setMark('textStyle', { fontFamily: font }).run();
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    editor?.chain().focus().setColor(color).run();
  };

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

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <EditorStyles />
      {!hideToolbar && (
        <EditorToolbar 
          editor={editor}
          currentFont={currentFont}
          currentColor={currentColor}
          onFontChange={handleFontChange}
          onColorChange={handleColorChange}
          handleIndent={handleIndent}
          handleOutdent={handleOutdent}
        />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

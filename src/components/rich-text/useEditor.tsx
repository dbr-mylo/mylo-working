
import { useState, useEffect } from 'react';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList, CustomOrderedList } from './extensions/CustomLists';
import { IndentExtension } from './extensions/IndentExtension';
import { FontFamily } from './extensions/FontFamily';

export interface UseEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onUpdate, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        // Ensure we don't import ListItem twice
        listItem: false,
      }),
      TextStyle,
      FontFamily,
      CustomBulletList,
      CustomOrderedList,
      Color,
      IndentExtension,
    ],
    content: content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      // Only update content from props if it's different from the editor content
      const editorContent = editor.getHTML();
      if (content !== editorContent) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const handleFontChange = (font: string) => {
    console.log(`Setting font to: ${font}`);
    setCurrentFont(font);
    if (editor) {
      // Use setMark directly since we removed the custom command
      editor.chain().focus().setMark('textStyle', { fontFamily: font }).run();
      console.log(`Font applied in editor: ${font}`);
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  return {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};

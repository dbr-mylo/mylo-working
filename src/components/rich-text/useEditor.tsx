
import { useState, useEffect } from 'react';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
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
      }),
      TextStyle,
      FontFamily,
      ListItem,
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

  return {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};

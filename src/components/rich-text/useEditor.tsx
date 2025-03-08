
import { useState, useEffect } from 'react';
import { useEditor as useTipTapEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList, CustomOrderedList } from './extensions/CustomLists';
import { IndentExtension } from './extensions/IndentExtension';
import { FontFamily } from './extensions/FontFamily';
import { Extension } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';

export interface UseEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onUpdate, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  // Use a custom extension to maintain a global editor color state
  const ColorStateExtension = Extension.create({
    name: 'colorState',
    addStorage() {
      return {
        color: '#000000'
      };
    },
  });

  // Customize Bold to integrate with our color tracking
  const CustomBold = Bold.configure({
    HTMLAttributes: {
      class: 'custom-bold',
    },
  });
  
  const editor = useTipTapEditor({
    extensions: [
      ColorStateExtension,
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        bold: false, // Disable default bold
      }),
      CustomBold, // Use our custom bold that has specific HTML attributes
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

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (editor) {
      // Store the color in our extension's storage
      editor.storage.colorState.color = color;
      editor.chain().focus().setColor(color).run();
    }
  };

  // Use an effect to track and maintain color state
  useEffect(() => {
    if (editor) {
      // This callback runs when the selection changes
      const updateListener = () => {
        const { color } = editor.getAttributes('textStyle');
        if (color) {
          setCurrentColor(color);
          // Update our stored color
          editor.storage.colorState.color = color;
        }
      };
      
      editor.on('selectionUpdate', updateListener);
      editor.on('transaction', updateListener);
      
      return () => {
        editor.off('selectionUpdate', updateListener);
        editor.off('transaction', updateListener);
      };
    }
  }, [editor]);

  return {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};


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
  
  // Create a custom Bold extension that preserves color
  const ColorPreservingBold = Bold.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        preserveColor: {
          default: null,
          parseHTML: () => null,
          renderHTML: () => ({}),
        },
      };
    },
  });
  
  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false, // Disable the default listItem to avoid duplication
        bold: false, // Disable default bold to use our custom one
      }),
      ColorPreservingBold, // Use our custom bold extension
      TextStyle,
      FontFamily,
      ListItem, // Add our custom listItem
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
    console.log(`Setting font to: ${font}`);
    setCurrentFont(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
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

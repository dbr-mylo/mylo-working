
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

export interface UseEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onUpdate, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  // Create a custom extension to preserve color when toggling bold
  const ColorPreservationExtension = Extension.create({
    name: 'colorPreservation',
    
    // Add a listener that reapplies color after bold is toggled
    addKeyboardShortcuts() {
      return {
        'Mod-b': () => {
          const { editor } = this;
          const { color } = editor.getAttributes('textStyle');
          
          // First toggle bold
          editor.chain().toggleBold().run();
          
          // If color exists and bold is active, reapply the color
          if (color && editor.isActive('bold')) {
            editor.chain().setColor(color).run();
          }
          
          return true;
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
      }),
      TextStyle,
      FontFamily,
      ListItem, // Add our custom listItem
      CustomBulletList,
      CustomOrderedList,
      Color,
      IndentExtension,
      ColorPreservationExtension, // Add our custom extension
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

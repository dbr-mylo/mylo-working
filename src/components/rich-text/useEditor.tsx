
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
  
  // Custom extension to preserve color when applying other marks
  const ColorPreservationExtension = StarterKit.configure({
    bulletList: false,
    orderedList: false,
    listItem: false,
    bold: {
      // Override the toggle command to preserve color
      toggleMark: ({ editor, mark }) => {
        const attributes = editor.getAttributes('textStyle');
        const { color } = attributes;
        
        // Execute the original toggle bold
        const toggleResult = editor.chain().toggleBold().run();
        
        // If color exists and bold was just applied, reapply color to the bold text
        if (color && editor.isActive('bold')) {
          editor.chain().setColor(color).run();
        }
        
        return toggleResult;
      }
    }
  });
  
  const editor = useTipTapEditor({
    extensions: [
      ColorPreservationExtension,
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

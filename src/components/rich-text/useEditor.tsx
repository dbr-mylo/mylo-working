
import { useState, useEffect } from 'react';
import { useEditor as useTipTapEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList, CustomOrderedList } from './extensions/CustomLists';
import { IndentExtension } from './extensions/IndentExtension';
import { FontFamily } from './extensions/FontFamily';
import Bold from '@tiptap/extension-bold';
import { useAuth } from '@/contexts/AuthContext';

export interface UseEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onUpdate, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // Create a custom Bold extension that preserves color
  const ColorPreservingBold = Bold.configure({
    HTMLAttributes: {
      class: 'color-preserving-bold',
    },
  });
  
  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        bold: false, // Disable default bold
      }),
      ColorPreservingBold,
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
      editor.chain().focus().setColor(color).run();
    }
  };

  // Monitor selection changes to update color state
  useEffect(() => {
    if (editor) {
      const updateColorState = () => {
        const { color } = editor.getAttributes('textStyle');
        if (color) {
          setCurrentColor(color);
        }
      };
      
      editor.on('selectionUpdate', updateColorState);
      editor.on('transaction', updateColorState);
      
      return () => {
        editor.off('selectionUpdate', updateColorState);
        editor.off('transaction', updateColorState);
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

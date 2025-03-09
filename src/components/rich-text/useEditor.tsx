
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
  onContentChange: (content: string) => void; // Changed from onUpdate to onContentChange
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onContentChange, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // Enhanced Bold extension with better color preservation
  const ColorPreservingBold = Bold.configure({
    HTMLAttributes: {
      class: 'color-preserving-bold',
    }
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
      TextStyle.configure({
        HTMLAttributes: {
          class: 'preserve-styling',
        },
      }),
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
      onContentChange(editor.getHTML());
      // Let's log the HTML on each update to check color preservation
      console.log("Editor HTML on update:", editor.getHTML());
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
      
      // If there's bold text selected, ensure it keeps the new color
      if (editor.isActive('bold')) {
        console.log("Bold is active, reapplying color:", color);
        // Toggle bold off and on to refresh the styling
        editor.chain().focus().toggleBold().toggleBold().run();
        // Re-apply color to make sure it sticks
        editor.chain().focus().setColor(color).run();
      }
    }
  };

  // Monitor selection changes to update color state
  useEffect(() => {
    if (editor) {
      const updateColorState = () => {
        const { color } = editor.getAttributes('textStyle');
        if (color) {
          setCurrentColor(color);
          console.log("Color state updated to:", color);
        }
      };
      
      // Add more detailed logging for debugging
      const logStyleChanges = () => {
        const textStyleAttrs = editor.getAttributes('textStyle');
        const isBoldActive = editor.isActive('bold');
        const boldAttrs = isBoldActive ? editor.getAttributes('bold') : 'not active';
        const html = editor.getHTML();
        
        console.log("Style change detected:", {
          textStyle: textStyleAttrs,
          isBold: isBoldActive,
          boldAttrs,
          selectionHtml: html.substring(0, 100) + (html.length > 100 ? '...' : '')
        });
      };
      
      editor.on('selectionUpdate', updateColorState);
      editor.on('transaction', updateColorState);
      
      // Add debug logging
      editor.on('selectionUpdate', logStyleChanges);
      editor.on('transaction', logStyleChanges);
      
      return () => {
        editor.off('selectionUpdate', updateColorState);
        editor.off('transaction', updateColorState);
        editor.off('selectionUpdate', logStyleChanges);
        editor.off('transaction', logStyleChanges);
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

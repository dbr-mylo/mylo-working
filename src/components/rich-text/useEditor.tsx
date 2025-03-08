
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
  
  // Custom Bold extension with improved color preservation
  const ColorPreservingBold = Bold.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-b': () => {
          if (isDesigner) {
            // Get current color before toggling
            const { color } = this.editor.getAttributes('textStyle');
            const colorToPreserve = color || currentColor;
            
            // Start a chain and execute both commands in a single transaction
            const chain = this.editor.chain().focus();
            
            // Toggle bold
            chain.toggleBold();
            
            // Reapply color in the same transaction
            if (colorToPreserve && colorToPreserve !== '#000000') {
              chain.setColor(colorToPreserve);
            }
            
            // Execute the combined chain
            chain.run();
            
            return true;
          } else {
            // Original behavior for non-designer roles
            // Get current color before toggling
            const { color } = this.editor.getAttributes('textStyle');
            // Store it for later use
            const colorToPreserve = color || currentColor;
            
            // Toggle bold
            this.editor.chain().toggleBold().run();
            
            // Reapply color if it exists and isn't default black
            if (colorToPreserve && colorToPreserve !== '#000000') {
              this.editor.chain().setColor(colorToPreserve).run();
            }
            
            return true;
          }
        },
      };
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
      ColorPreservingBold, // Use our improved custom bold extension
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

import { useState, useEffect } from 'react';
import { useEditor as useTipTapEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList, CustomOrderedList } from './extensions/CustomLists';
import { IndentExtension } from './extensions/IndentExtension';
import { FontFamily } from './extensions/FontFamily';
import { FontSize } from './extensions/FontSize';
import Bold from '@tiptap/extension-bold';
import { useAuth } from '@/contexts/AuthContext';
import { textStyleStore } from '@/stores/textStyles';

export interface UseEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onContentChange, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Merriweather');
  const [currentColor, setCurrentColor] = useState('#000000');
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // Clear font caches on mount
  useEffect(() => {
    console.log("useEditorSetup: Clearing font caches");
    textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize', 'fontFamily']);
    localStorage.removeItem('editor_font_size');
    
    // Force a clear cache event
    try {
      const clearEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(clearEvent);
    } catch (error) {
      console.error("Error dispatching clear cache event:", error);
    }
  }, []);
  
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
      FontSize, // Add the FontSize extension
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
      
      // Re-apply any font size to ensure consistency
      try {
        const attributes = editor.getAttributes('textStyle');
        if (attributes.fontSize) {
          console.log("Editor updating with fontSize:", attributes.fontSize);
          
          // Dispatch an event to notify components about the current font size
          const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
            detail: { fontSize: attributes.fontSize }
          });
          document.dispatchEvent(fontSizeEvent);
        }
      } catch (error) {
        console.error("Error handling editor update:", error);
      }
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
        }
      };
      
      // Monitor font size changes
      const updateFontSize = () => {
        const { fontSize } = editor.getAttributes('textStyle');
        if (fontSize) {
          console.log("Font size detected in selection:", fontSize);
          
          // Broadcast the font size change
          const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
            detail: { fontSize }
          });
          document.dispatchEvent(fontSizeEvent);
        }
      };
      
      editor.on('selectionUpdate', updateColorState);
      editor.on('selectionUpdate', updateFontSize);
      editor.on('transaction', updateColorState);
      editor.on('transaction', updateFontSize);
      
      return () => {
        editor.off('selectionUpdate', updateColorState);
        editor.off('selectionUpdate', updateFontSize);
        editor.off('transaction', updateColorState);
        editor.off('transaction', updateFontSize);
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

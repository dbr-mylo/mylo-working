
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

export interface UseEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable?: boolean;
}

export const useEditorSetup = ({ content, onContentChange, isEditable = true }: UseEditorProps) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentFontSize, setCurrentFontSize] = useState('16px');
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
      // Update current font state for the toolbar display
      updateStyleState(editor);
      // Let's log the HTML on update to check color preservation
      console.log("Editor HTML on update:", editor.getHTML().substring(0, 200));
    },
  });

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const handleFontSizeChange = (size: string) => {
    setCurrentFontSize(size);
    if (editor) {
      editor.chain().focus().setFontSize(size).run();
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

  // Helper function to update the style state based on current selection
  const updateStyleState = (editorInstance: Editor) => {
    if (!editorInstance) return;
    
    // Get attributes from the current selection
    const attrs = editorInstance.getAttributes('textStyle');
    
    // Update font state if available in selection
    if (attrs.fontFamily) {
      setCurrentFont(attrs.fontFamily);
    }
    
    // Update font size state if available in selection
    if (attrs.fontSize) {
      setCurrentFontSize(attrs.fontSize);
    }
    
    // Update color state if available in selection
    if (attrs.color) {
      setCurrentColor(attrs.color);
    }
  };

  // Monitor selection changes to update state
  useEffect(() => {
    if (editor) {
      // Function to update UI state based on current selection
      const handleSelectionUpdate = () => {
        updateStyleState(editor);
      };
      
      // Register event listeners
      editor.on('selectionUpdate', handleSelectionUpdate);
      editor.on('focus', handleSelectionUpdate);
      editor.on('transaction', handleSelectionUpdate);
      
      // Initial update when editor is mounted
      handleSelectionUpdate();
      
      // Cleanup listeners on unmount
      return () => {
        editor.off('selectionUpdate', handleSelectionUpdate);
        editor.off('focus', handleSelectionUpdate);
        editor.off('transaction', handleSelectionUpdate);
      };
    }
  }, [editor]);

  return {
    editor,
    currentFont,
    currentColor,
    currentFontSize,
    handleFontChange,
    handleColorChange,
    handleFontSizeChange
  };
};

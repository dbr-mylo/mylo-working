
import { useState } from 'react';
import { useEditor as useTipTapEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList, CustomOrderedList } from '../extensions/CustomLists';
import { IndentExtension } from '../extensions/IndentExtension';
import { FontFamily } from '../extensions/FontFamily';
import { FontSize } from '../extensions/FontSize';
import Bold from '@tiptap/extension-bold';

// Enhanced Bold extension with better color preservation
const ColorPreservingBold = Bold.configure({
  HTMLAttributes: {
    class: 'color-preserving-bold',
  }
});

export interface UseEditorCoreProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable?: boolean;
  pageDimensions?: {
    width: string;
    height: string;
  };
}

export const useEditorCore = ({ 
  content, 
  onContentChange, 
  isEditable = true,
  pageDimensions = {
    width: '8.5in',
    height: '11in'
  }
}: UseEditorCoreProps) => {
  
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
      FontSize.configure({
        types: ['textStyle'],
        defaultSize: '16px',
      }),
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
            detail: { fontSize: attributes.fontSize, source: 'editor-update' }
          });
          document.dispatchEvent(fontSizeEvent);
        }
      } catch (error) {
        console.error("Error handling editor update:", error);
      }
    },
  });

  return editor;
};

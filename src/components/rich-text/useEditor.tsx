
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback } from 'react';
import { FontSize } from './extensions/FontSize';
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { FontUnit } from "@/lib/types/preferences";

interface EditorSetupProps {
  content: string;
  onContentChange?: (content: string) => void;
  isEditable?: boolean;
  currentUnit?: FontUnit;
}

export const useEditorSetup = ({ content, onContentChange, isEditable = true, currentUnit = 'px' }: EditorSetupProps) => {
  const [currentFont, setCurrentFont] = useState<string | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState<string | undefined>(undefined);
  
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const defaultUnit = preferences?.typography?.fontUnit || 'px';
  const editorUnit = currentUnit || defaultUnit;

  const handleFontChange = useCallback((font: string) => {
    if (!font) {
      setCurrentFont(undefined);
      return;
    }
    setCurrentFont(font);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    if (!color) {
      setCurrentColor(undefined);
      return;
    }
    setCurrentColor(color);
  }, []);

  // Create and configure the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
          newGroupDelay: 500
        }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      ListItem,
      OrderedList,
      BulletList,
      Placeholder.configure({
        placeholder: 'Type something here...',
      }),
      
      FontSize.configure({
        types: ['textStyle'],
        defaultUnit: editorUnit,
      }),
    ],
    content,
    editable: isEditable,
    injectCSS: true,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        const html = editor.getHTML();
        onContentChange(html);
      }
    },
  });

  return {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};

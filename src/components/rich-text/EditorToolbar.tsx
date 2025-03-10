import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { FormatButtons } from './toolbar/FormatButtons';
import { IndentButtons } from './toolbar/IndentButtons';
import { StyleDropdown } from './StyleDropdown';
import { Separator } from '@/components/ui/separator';
import { FontSizeTool } from './toolbar/FontSizeTool';
import { useDocument } from '@/hooks/document';
import { useParams } from 'react-router-dom';

interface EditorToolbarProps {
  editor: Editor;
  currentFont?: string;
  currentColor?: string;
  onFontChange?: (font: string) => void;
  onColorChange?: (color: string) => void;
}

export const EditorToolbar = ({ editor, currentFont, currentColor, onFontChange, onColorChange }: EditorToolbarProps) => {
  const { role } = useAuth();
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = preferences?.typography?.fontUnit || 'px';
  const isDesigner = role === "designer";
  const buttonSize = isDesigner ? "xxs" : "sm";
  
  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    onFontChange?.(font);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1">
      {/* Font Controls */}
      <FontPicker
        value={currentFont || ""}
        onChange={(value) => onFontChange?.(value)}
      />
      
      {/* Font Size Tool */}
      <FontSizeTool editor={editor} currentUnit={currentUnit} />
      
      {/* Color Picker */}
      <ColorPicker
        value={currentColor || ""}
        onChange={(value) => onColorChange?.(value)}
      />
      
      {/* Formatting Buttons */}
      <FormatButtons 
        editor={editor}
        currentColor={currentColor}
        buttonSize={buttonSize}
      />
      
      {/* Indent Buttons */}
      <IndentButtons 
        editor={editor}
        buttonSize={buttonSize}
      />

      {/* Separator */}
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      {/* Style Dropdown */}
      <StyleDropdown editor={editor} />
    </div>
  );
};

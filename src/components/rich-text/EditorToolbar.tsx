
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { useAuth } from '@/contexts/AuthContext';
import { FormatButtons } from './toolbar/FormatButtons';
import { handleIndent, handleOutdent } from './toolbar/indentationUtils';
import { handleBoldClick as boldClickHandler, preserveColorAfterFormatting as preserveColor } from './toolbar/colorUtils';

interface EditorToolbarProps {
  editor: Editor | null;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    onFontChange(font);
  };

  const handleBoldClick = () => {
    boldClickHandler(editor, currentColor);
  };

  const preserveColorAfterFormatting = (formatCommand: () => void) => {
    preserveColor(editor, currentColor, formatCommand);
  };

  const handleIndentation = () => {
    handleIndent(editor);
  };

  const handleOutdentation = () => {
    handleOutdent(editor);
  };

  return (
    <div className="flex items-center gap-2 py-2 px-4 border-b border-editor-border bg-white">
      <FontPicker value={currentFont} onChange={handleFontChange} />
      <ColorPicker value={currentColor} onChange={onColorChange} />
      <FormatButtons 
        editor={editor}
        currentColor={currentColor}
        handleBoldClick={handleBoldClick}
        preserveColorAfterFormatting={preserveColorAfterFormatting}
        handleIndent={handleIndentation}
        handleOutdent={handleOutdentation}
      />
    </div>
  );
};


import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { FormatButtons } from './toolbar/FormatButtons';
import { IndentButtons } from './toolbar/IndentButtons';
import { StyleDropdown } from './StyleDropdown';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const buttonSize = isDesigner ? "xxs" : "sm";
  
  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    onFontChange(font);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = e.target.value;
    if (editor) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
  };

  // Get current font size from editor (if available)
  const getCurrentFontSize = () => {
    if (!editor) return "16";
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      return attrs.fontSize.replace('px', '');
    }
    return "16";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <FontPicker value={currentFont} onChange={handleFontChange} />
        {isDesigner && (
          <div className="flex items-center gap-1">
            <Label htmlFor="font-size" className="text-xs whitespace-nowrap">Size:</Label>
            <Input
              id="font-size"
              type="number"
              min={8}
              max={99}
              maxLength={2}
              value={getCurrentFontSize()}
              onChange={handleFontSizeChange}
              className="w-14 h-7 text-xs"
            />
          </div>
        )}
      </div>
      
      <ColorPicker value={currentColor} onChange={onColorChange} />
      
      <FormatButtons 
        editor={editor}
        currentColor={currentColor}
        buttonSize={buttonSize}
      />
      
      <IndentButtons 
        editor={editor}
        buttonSize={buttonSize}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <StyleDropdown editor={editor} />
    </div>
  );
};

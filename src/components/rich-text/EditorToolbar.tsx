
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
import { ChevronUp, ChevronDown } from 'lucide-react';

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
    const size = e.target.value.replace(/\D/g, '').substring(0, 2);
    if (size && editor) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
  };

  const increaseFontSize = () => {
    const currentSize = parseInt(getCurrentFontSize(), 10);
    const newSize = Math.min(currentSize + 1, 72); // Max size 72px
    if (editor) {
      editor.chain().focus().setFontSize(`${newSize}px`).run();
    }
  };

  const decreaseFontSize = () => {
    const currentSize = parseInt(getCurrentFontSize(), 10);
    const newSize = Math.max(currentSize - 1, 8); // Min size 8px
    if (editor) {
      editor.chain().focus().setFontSize(`${newSize}px`).run();
    }
  };

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
            <div className="relative w-12">
              <Input
                id="font-size"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={getCurrentFontSize()}
                onChange={handleFontSizeChange}
                className="w-12 h-7 text-xs pr-5"
              />
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center">
                <button
                  type="button"
                  className="flex items-center justify-center h-3.5 w-5 text-gray-500 hover:text-gray-700"
                  onClick={increaseFontSize}
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center h-3.5 w-5 text-gray-500 hover:text-gray-700"
                  onClick={decreaseFontSize}
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
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

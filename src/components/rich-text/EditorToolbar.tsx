
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
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="flex items-center">
              <Input
                id="font-size"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={getCurrentFontSize()}
                onChange={handleFontSizeChange}
                className="w-12 h-7 text-xs"
              />
              <div className="flex flex-col ml-1">
                <Button 
                  variant="ghost" 
                  size="xxs" 
                  className="h-3.5 px-1" 
                  onClick={increaseFontSize}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="xxs" 
                  className="h-3.5 px-1" 
                  onClick={decreaseFontSize}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
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

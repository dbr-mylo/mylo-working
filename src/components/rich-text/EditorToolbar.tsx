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
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop propagation to prevent editor from capturing the input
    
    const size = e.target.value.replace(/\D/g, '');
    if (editor) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
  };

  const increaseFontSize = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    
    const currentSize = parseInt(getCurrentFontSize(), 10);
    const newSize = Math.min(currentSize + 1, 72); // Max size 72px
    if (editor) {
      editor.chain().setFontSize(`${newSize}px`).run();
    }
  };

  const decreaseFontSize = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    
    const currentSize = parseInt(getCurrentFontSize(), 10);
    const newSize = Math.max(currentSize - 1, 8); // Min size 8px
    if (editor) {
      editor.chain().setFontSize(`${newSize}px`).run();
    }
  };

  const getCurrentFontSize = () => {
    if (!editor) return "16";
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      return attrs.fontSize.replace(/[^0-9.]/g, '');
    }
    return "16";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <FontPicker value={currentFont} onChange={handleFontChange} />
        
        {isDesigner && (
          <div className="flex items-center gap-1">
            <div className="relative flex items-center">
              <div className="relative w-12">
                <Input
                  id="font-size"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={getCurrentFontSize()}
                  onChange={handleFontSizeChange}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 h-7 text-xs pr-5 text-center"
                />
                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center h-3.5 w-5 text-gray-500 hover:text-gray-700"
                    onClick={increaseFontSize}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center h-3.5 w-5 text-gray-500 hover:text-gray-700"
                    onClick={decreaseFontSize}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <span className="text-xs text-gray-500 ml-1">px</span>
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

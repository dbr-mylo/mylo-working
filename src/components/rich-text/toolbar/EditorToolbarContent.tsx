
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontPicker } from '../FontPicker';
import { ColorPicker } from '../ColorPicker';
import { FormatButtons } from './FormatButtons';
import { IndentButtons } from './IndentButtons';
import { StyleDropdown } from '../StyleDropdown';
import { Separator } from '@/components/ui/separator';
import { FontSizeSection } from './FontSizeSection';
import { useAuth } from '@/contexts/AuthContext';
import { useFontSizeTracking } from './hooks/useFontSizeTracking';
import { Button } from '@/components/ui/button';
import { RemoveFormatting } from 'lucide-react';
import { clearFormatting } from '../utils/textFormatting';

interface EditorToolbarContentProps {
  editor: Editor;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const EditorToolbarContent: React.FC<EditorToolbarContentProps> = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const buttonSize = isDesigner ? "xxs" : "sm";
  
  const { 
    currentFontSize, 
    isTextSelected, 
    handleFontSizeChange 
  } = useFontSizeTracking(editor);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FontPicker value={currentFont} onChange={onFontChange} />
      
      {isDesigner && (
        <FontSizeSection 
          editor={editor}
          currentFontSize={currentFontSize}
          isTextSelected={isTextSelected}
          onFontSizeChange={handleFontSizeChange}
        />
      )}
      
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
      
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={() => clearFormatting(editor)}
        title="Clear formatting"
        className="flex items-center gap-1"
      >
        <RemoveFormatting className="h-4 w-4" />
        Clear
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <StyleDropdown editor={editor} />
    </div>
  );
};

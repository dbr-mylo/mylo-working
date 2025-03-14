import React from 'react';
import { Editor } from '@tiptap/react';
import { FontPicker } from '../FontPicker';
import { ColorPicker } from '../ColorPicker';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useFontSizeTracking } from './hooks/useFontSizeTracking';
import { FontSizeControls } from '../font-size/FontSizeControls';
import { FormatControls } from './FormatControls';
import { ClearFormattingControl } from './ClearFormattingControl';
import { StyleControls } from './StyleControls';

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
  const buttonSize = isDesigner ? "xxs" : "xs";
  
  const { 
    currentFontSize, 
    isTextSelected, 
    handleFontSizeChange 
  } = useFontSizeTracking(editor);

  return (
    <div className="flex items-center gap-1 flex-wrap p-0.5">
      <FontPicker value={currentFont} onChange={onFontChange} />
      
      {isDesigner && (
        <FontSizeControls 
          editor={editor}
          currentFontSize={currentFontSize}
          isTextSelected={isTextSelected}
          onFontSizeChange={handleFontSizeChange}
        />
      )}
      
      <ColorPicker value={currentColor} onChange={onColorChange} />
      
      <FormatControls 
        editor={editor}
        currentColor={currentColor}
        buttonSize={buttonSize}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      <ClearFormattingControl 
        editor={editor}
        onFontChange={onFontChange}
        onColorChange={onColorChange}
        buttonSize={buttonSize}
        isDesigner={isDesigner}
      />
      
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      <StyleControls editor={editor} />
    </div>
  );
};

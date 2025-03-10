
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { FormatButtons } from './toolbar/FormatButtons';
import { IndentButtons } from './toolbar/IndentButtons';
import { StyleDropdown } from './StyleDropdown';
import { Separator } from '@/components/ui/separator';
import { FontSizeInput } from './FontSizeInput';

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
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      const fontSize = editor.getAttributes('textStyle').fontSize;
      if (fontSize) {
        console.log("EditorToolbar: Font size from editor:", fontSize);
        // Only update if the font size is different from current state
        if (fontSize !== currentFontSize) {
          setCurrentFontSize(fontSize);
        }
      }
    };
    
    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);
    
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor, currentFontSize]);
  
  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    onFontChange(font);
  };
  
  const handleFontSizeChange = (fontSize: string) => {
    console.log("EditorToolbar: Changing font size to:", fontSize);
    // Set the font size in the editor
    editor.chain().focus().setFontSize(fontSize).run();
    // Update local state
    setCurrentFontSize(fontSize);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FontPicker value={currentFont} onChange={handleFontChange} />
      
      {isDesigner && (
        <FontSizeInput 
          value={currentFontSize} 
          onChange={handleFontSizeChange} 
          className="ml-1 mr-1" 
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
      
      <StyleDropdown editor={editor} />
    </div>
  );
};

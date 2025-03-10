
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
  const [isTextSelected, setIsTextSelected] = useState(false);
  
  // Clear all cached styles/preferences on component mount
  useEffect(() => {
    try {
      // Clear any potentially stored font sizes from localStorage
      localStorage.removeItem('editor_font_size');
      
      // Clear session storage as well
      sessionStorage.clear();
      
      console.log("EditorToolbar: Cleared cache and storage");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, []);
  
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      // First check the editor's attributes
      const fontSize = editor.getAttributes('textStyle').fontSize;
      
      if (fontSize) {
        console.log("EditorToolbar: Font size from editor:", fontSize);
        setCurrentFontSize(fontSize);
      } else {
        // Check if we have a stored value to fall back on
        const storedFontSize = localStorage.getItem('editor_font_size');
        if (storedFontSize) {
          console.log("EditorToolbar: Using stored font size:", storedFontSize);
          setCurrentFontSize(storedFontSize);
        }
      }
    };

    const updateTextSelection = () => {
      const { from, to } = editor.state.selection;
      const isSelected = from !== to;
      setIsTextSelected(isSelected);
    };
    
    editor.on('selectionUpdate', updateFontSize);
    editor.on('selectionUpdate', updateTextSelection);
    editor.on('transaction', updateFontSize);
    
    // Initial update
    updateFontSize();
    updateTextSelection();
    
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('selectionUpdate', updateTextSelection);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);
  
  const handleFontChange = (font: string) => {
    onFontChange(font);
  };
  
  const handleFontSizeChange = (fontSize: string) => {
    if (!editor) return;
    
    console.log("EditorToolbar: Setting font size to:", fontSize);
    // Set state first for immediate UI update
    setCurrentFontSize(fontSize);
    // Then update the editor
    editor.chain().focus().setFontSize(fontSize).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FontPicker value={currentFont} onChange={handleFontChange} />
      
      {isDesigner && (
        <FontSizeInput 
          value={currentFontSize} 
          onChange={handleFontSizeChange} 
          className="ml-1 mr-1"
          disabled={!isTextSelected}
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

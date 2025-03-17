
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

export const useFontAndColorState = (editor: Editor | null) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (editor) {
      editor.chain().focus().setColor(color).run();
      
      // If there's bold text selected, ensure it keeps the new color
      if (editor.isActive('bold')) {
        console.log("Bold is active, reapplying color:", color);
        // Toggle bold off and on to refresh the styling
        editor.chain().focus().toggleBold().toggleBold().run();
        // Re-apply color to make sure it sticks
        editor.chain().focus().setColor(color).run();
      }
    }
  };
  
  // Monitor selection changes to update color and font size state
  useEffect(() => {
    if (!editor) return;
    
    const updateColorState = () => {
      const { color } = editor.getAttributes('textStyle');
      if (color) {
        setCurrentColor(color);
      }
    };
    
    // Also update font family state when selection changes
    const updateFontState = () => {
      const { fontFamily } = editor.getAttributes('textStyle');
      if (fontFamily) {
        setCurrentFont(fontFamily);
      }
    };
    
    editor.on('selectionUpdate', () => {
      updateColorState();
      updateFontState();
    });
    
    editor.on('transaction', () => {
      updateColorState();
      updateFontState();
    });
    
    return () => {
      editor.off('selectionUpdate', updateColorState);
      editor.off('transaction', updateColorState);
    };
  }, [editor]);

  return {
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};

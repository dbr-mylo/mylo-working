import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { FormatButtons } from './toolbar/FormatButtons';
import { IndentButtons } from './toolbar/IndentButtons';
import { StyleDropdown } from './StyleDropdown';
import { Separator } from '@/components/ui/separator';
import { FontSizeInput } from './FontSizeInput';
import { textStyleStore } from '@/stores/textStyles';

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
      
      // Clear cached text styles
      textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize']);
      
      console.log("EditorToolbar: Cleared font size cache");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, []);
  
  // Function to update font size from events
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (event.detail && event.detail.fontSize) {
      console.log("EditorToolbar: Font size change event detected:", event.detail.fontSize);
      setCurrentFontSize(event.detail.fontSize);
    }
  }, []);
  
  // Listen for font size change events from the FontSize extension
  useEffect(() => {
    // Add event listeners with proper typing
    document.addEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    document.addEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
      document.removeEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);
  
  // Monitor editor for font size changes
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      // Get font size from editor attributes
      const fontSize = editor.getAttributes('textStyle').fontSize;
      
      if (fontSize) {
        console.log("EditorToolbar: Font size from editor attributes:", fontSize);
        setCurrentFontSize(fontSize);
        
        // Dispatch an event to keep other components in sync
        try {
          const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
            detail: { fontSize }
          });
          document.dispatchEvent(fontSizeEvent);
        } catch (e) {
          console.error("Error dispatching font size event:", e);
        }
      } else {
        // Try to get font size from computed style of selected element
        try {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            
            // Only try to surround if there's actual content
            if (range && !range.collapsed) {
              try {
                // Clone the range to avoid modifying the actual DOM
                const clonedRange = range.cloneRange();
                const tempDiv = document.createElement('div');
                tempDiv.appendChild(clonedRange.cloneContents());
                
                // Get computed style from the first text node
                const textNodes = tempDiv.querySelectorAll('*');
                if (textNodes.length > 0) {
                  const computedStyle = window.getComputedStyle(textNodes[0]);
                  const computedFontSize = computedStyle.fontSize;
                  console.log("EditorToolbar: Computed font size:", computedFontSize);
                  
                  if (computedFontSize && computedFontSize !== currentFontSize) {
                    setCurrentFontSize(computedFontSize);
                  }
                }
              } catch (err) {
                console.error("Error getting computed style:", err);
              }
            }
          }
        } catch (error) {
          console.error("Error analyzing selection:", error);
        }
      }
    };

    const updateTextSelection = () => {
      const { from, to } = editor.state.selection;
      const isSelected = from !== to;
      setIsTextSelected(isSelected);
      
      // When text is selected, check its font size
      if (isSelected) {
        updateFontSize();
      }
    };
    
    // Add event listeners to editor
    editor.on('selectionUpdate', updateFontSize);
    editor.on('selectionUpdate', updateTextSelection);
    editor.on('transaction', updateFontSize);
    
    // Initial update
    updateFontSize();
    updateTextSelection();
    
    return () => {
      // Clean up event listeners
      editor.off('selectionUpdate', updateFontSize);
      editor.off('selectionUpdate', updateTextSelection);
      editor.off('transaction', updateFontSize);
    };
  }, [editor, currentFontSize]);
  
  const handleFontChange = (font: string) => {
    onFontChange(font);
  };
  
  const handleFontSizeChange = (fontSize: string) => {
    if (!editor) return;
    
    console.log("EditorToolbar: Setting font size to:", fontSize);
    // Update state and editor
    setCurrentFontSize(fontSize);
    editor.chain().focus().setFontSize(fontSize).run();
    
    // Force a second font size update to ensure it takes effect
    setTimeout(() => {
      if (editor && editor.isActive) {
        console.log("EditorToolbar: Re-applying font size:", fontSize);
        editor.chain().focus().setFontSize(fontSize).run();
      }
    }, 50);
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

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
  
  // Listen for font size change events from the FontSize extension
  useEffect(() => {
    const handleFontSizeChanged = (event: CustomEvent) => {
      if (event.detail && event.detail.fontSize) {
        console.log("EditorToolbar: Font size change event detected:", event.detail.fontSize);
        setCurrentFontSize(event.detail.fontSize);
      }
    };
    
    document.addEventListener('tiptap-font-size-changed', handleFontSizeChanged as EventListener);
    document.addEventListener('tiptap-font-size-parsed', handleFontSizeChanged as EventListener);
    
    return () => {
      document.removeEventListener('tiptap-font-size-changed', handleFontSizeChanged as EventListener);
      document.removeEventListener('tiptap-font-size-parsed', handleFontSizeChanged as EventListener);
    };
  }, []);
  
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      // First check the editor's attributes
      const fontSize = editor.getAttributes('textStyle').fontSize;
      
      if (fontSize) {
        console.log("EditorToolbar: Font size from editor:", fontSize);
        setCurrentFontSize(fontSize);
        
        // Update localStorage to keep things in sync
        localStorage.setItem('editor_font_size', fontSize);
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
      
      // When text is selected, immediately check its font size
      if (isSelected) {
        updateFontSize();
      }
    };
    
    // Add a log of the HTML content whenever selection changes
    const logHtmlContent = () => {
      console.log("Current HTML at selection:", editor.getHTML().substring(0, 100));
      
      // Check for font-size style in the current selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range) {
          const span = document.createElement('span');
          range.surroundContents(span);
          const computedStyle = window.getComputedStyle(span);
          console.log("Computed font-size at selection:", computedStyle.fontSize);
          
          // Unwrap the span to restore the original DOM
          const parent = span.parentNode;
          if (parent) {
            while (span.firstChild) {
              parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
          }
        }
      }
    };
    
    editor.on('selectionUpdate', updateFontSize);
    editor.on('selectionUpdate', updateTextSelection);
    editor.on('selectionUpdate', logHtmlContent);
    editor.on('transaction', updateFontSize);
    
    // Initial update
    updateFontSize();
    updateTextSelection();
    
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('selectionUpdate', updateTextSelection);
      editor.off('selectionUpdate', logHtmlContent);
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
    // Then update the editor with the important flag to override any parent styles
    editor.chain().focus().setFontSize(fontSize).run();
    
    // Force a second update after a brief delay to ensure it takes effect
    setTimeout(() => {
      if (editor && editor.isActive) {
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

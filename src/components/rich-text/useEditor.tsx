
import { useEditorCore, UseEditorCoreProps } from './hooks/useEditorCore';
import { useFontAndColorState } from './hooks/useFontAndColorState';
import { useFontSizeSync } from './hooks/useFontSizeSync';
import { useEditorCleanup } from './hooks/useEditorCleanup';
import { useAuth } from '@/contexts/AuthContext';

export type { UseEditorCoreProps as UseEditorProps };

export const useEditorSetup = ({ content, onContentChange, isEditable = true }: UseEditorCoreProps) => {
  // Perform initial cleanup
  useEditorCleanup();
  
  // Initialize the editor core
  const editor = useEditorCore({ 
    content, 
    onContentChange, 
    isEditable 
  });
  
  // Handle font and color state
  const { 
    currentFont, 
    currentColor, 
    handleFontChange, 
    handleColorChange 
  } = useFontAndColorState(editor);
  
  // Handle font size synchronization
  useFontSizeSync(editor);

  // Role check (kept from original)
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  };
};

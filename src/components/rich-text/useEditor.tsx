
import { useEditorCore, UseEditorCoreProps } from './hooks/useEditorCore';
import { useFontAndColorState } from './hooks/useFontAndColorState';
import { useFontSizeSync } from './hooks/useFontSizeSync';
import { useEditorCleanup } from './hooks/useEditorCleanup';
import { useAuth } from '@/contexts/AuthContext';

export type { UseEditorCoreProps as UseEditorProps };

export interface PageDimensions {
  width: string;
  height: string;
}

export interface UseEditorSetupProps extends UseEditorCoreProps {
  pageDimensions?: PageDimensions;
}

export const useEditorSetup = ({ 
  content, 
  onContentChange, 
  isEditable = true,
  pageDimensions = {
    width: '8.5in',
    height: '11in'
  }
}: UseEditorSetupProps) => {
  // Perform initial cleanup
  useEditorCleanup();
  
  // Initialize the editor core
  const editor = useEditorCore({ 
    content, 
    onContentChange, 
    isEditable,
    pageDimensions
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

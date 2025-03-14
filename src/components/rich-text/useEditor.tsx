
import { useEditorCore, UseEditorCoreProps } from './hooks/useEditorCore';
import { useFontAndColorState } from './hooks/useFontAndColorState';
import { useFontSizeSync } from './hooks/useFontSizeSync';
import { useEditorCleanup } from './hooks/useEditorCleanup';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export type { UseEditorCoreProps as UseEditorProps };

export interface TemplateStyles {
  dimensions?: {
    width: string;
    height: string;
  };
}

export interface UseEditorSetupProps extends UseEditorCoreProps {
  templateStyles?: string;
}

// Helper function to extract dimensions from CSS text
const extractDimensionsFromCSS = (css: string): { width: string; height: string } | undefined => {
  if (!css) return undefined;
  
  // Look for page size definitions in the CSS
  const widthMatch = css.match(/\.template-styled\s*{[^}]*width\s*:\s*([^;]+);/);
  const heightMatch = css.match(/\.template-styled\s*{[^}]*height\s*:\s*([^;]+);/);
  
  if (widthMatch?.[1] && heightMatch?.[1]) {
    return {
      width: widthMatch[1].trim(),
      height: heightMatch[1].trim()
    };
  }
  
  return undefined;
};

export const useEditorSetup = ({ 
  content, 
  onContentChange, 
  isEditable = true,
  templateStyles = '' 
}: UseEditorSetupProps) => {
  // Perform initial cleanup
  useEditorCleanup();
  
  // Extract dimensions from template styles if available
  const templateDimensions = useMemo(() => {
    return extractDimensionsFromCSS(templateStyles);
  }, [templateStyles]);
  
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
    handleColorChange,
    templateDimensions
  };
};

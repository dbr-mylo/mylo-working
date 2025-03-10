
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { getPreviewVisibilityPreference, setPreviewVisibilityPreference } from "@/components/editor-nav/EditorNavUtils";
import { useTextStyleOperations, useTextStyleCSS } from "@/stores/textStyles";

interface UseDesignPanelProps {
  content: string;
  isEditable: boolean;
  isStandalone: boolean;
}

export const useDesignPanel = ({ content, isEditable, isStandalone }: UseDesignPanelProps) => {
  const { toast } = useToast();
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = preferences?.typography?.fontUnit || 'px';
  
  const [designContent, setDesignContent] = useState(content);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    if (isStandalone) {
      return getPreviewVisibilityPreference();
    }
    return true;
  });
  
  // Use the new useTextStyleCSS hook instead of generating CSS directly
  const { css: customStyles } = useTextStyleCSS(currentUnit);
  
  // Get the text style operations
  const { saveTextStyle } = useTextStyleOperations();
  
  useEffect(() => {
    if (isStandalone) {
      setPreviewVisibilityPreference(isPreviewVisible);
    }
  }, [isPreviewVisible, isStandalone]);
  
  // Update design content when content changes and not editable
  useEffect(() => {
    if (content !== designContent && !isEditable) {
      setDesignContent(content);
    }
  }, [content, designContent, isEditable]);
  
  const handleContentChange = (newContent: string) => {
    setDesignContent(newContent);
  };

  const handleElementSelect = (element: HTMLElement | null) => {
    setSelectedElement(element);
  };
  
  const handleStyleChange = (styles: Record<string, string>) => {
    if (!selectedElement) return;
    
    Object.entries(styles).forEach(([property, value]) => {
      selectedElement.style[property as any] = value;
    });
  };

  const handleSaveStyle = async (styleData: any) => {
    try {
      await saveTextStyle(styleData);
      
      toast({
        title: "Style saved",
        description: "Text style has been saved to your collection.",
      });
    } catch (error) {
      console.error("Error saving text style:", error);
      toast({
        title: "Error saving style",
        description: "There was a problem saving your text style.",
        variant: "destructive",
      });
    }
  };
  
  const handleTogglePreview = () => {
    setIsPreviewVisible(prev => !prev);
  };

  return {
    designContent,
    customStyles,
    selectedElement,
    isPreviewVisible,
    currentUnit,
    handleContentChange,
    handleElementSelect,
    handleStyleChange,
    handleSaveStyle,
    handleTogglePreview
  };
};

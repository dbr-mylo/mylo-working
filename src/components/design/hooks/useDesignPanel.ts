
import { useState, useEffect } from "react";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { getPreviewVisibilityPreference, setPreviewVisibilityPreference } from "@/components/editor-nav/EditorNavUtils";

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
  const [customStyles, setCustomStyles] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    if (isStandalone) {
      return getPreviewVisibilityPreference();
    }
    return true;
  });
  
  // Update CSS when preferences change
  useEffect(() => {
    const generateStyles = async () => {
      const styles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(styles, currentUnit);
      setCustomStyles(css);
    };
    
    generateStyles();
  }, [currentUnit]);
  
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
  
  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
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
      await textStyleStore.saveTextStyle(styleData);
      
      const styles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(styles, currentUnit);
      setCustomStyles(css);
      
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
    handleStylesChange,
    handleElementSelect,
    handleStyleChange,
    handleSaveStyle,
    handleTogglePreview
  };
};

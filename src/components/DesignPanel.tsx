
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast"; 
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { useTemplateStyles } from "@/components/design/useTemplateStyles";
import { DesignerStandaloneView } from "@/components/design/DesignerStandaloneView";
import { EditorView } from "@/components/design/EditorView";

interface DesignPanelProps {
  content: string;
  isEditable: boolean;
  templateId?: string;
  multiPageContent?: string[];
  currentPageIndex?: number;
}

export const DesignPanel = ({ 
  content, 
  isEditable, 
  templateId,
  multiPageContent = [],
  currentPageIndex = 0
}: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  
  const [designContent, setDesignContent] = useState(content);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const { customStyles, handleStylesChange } = useTemplateStyles(templateId);
  
  // Handle content change from EditorPanel
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
      await textStyleStore.saveTextStyle(styleData);
      
      const styles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(styles);
      handleStylesChange(css);
      
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
  
  // Determine if we have multi-page content
  const hasMultiplePages = multiPageContent.length > 1;
  const totalPages = hasMultiplePages ? multiPageContent.length : 1;
  const displayContent = hasMultiplePages ? 
    multiPageContent[currentPageIndex] : 
    designContent;
  
  const editorSetup = isEditable && isStandalone ? 
    useEditorSetup({ 
      content: displayContent, 
      onContentChange: handleContentChange,
      isEditable 
    }) : null;
  
  if (isStandalone) {
    return (
      <DesignerStandaloneView
        content={content}
        designContent={displayContent}
        customStyles={customStyles}
        isEditable={isEditable}
        editorSetup={editorSetup}
        onContentChange={handleContentChange}
        onElementSelect={handleElementSelect}
      />
    );
  }
  
  return (
    <EditorView
      content={displayContent}
      customStyles={customStyles}
      isEditable={isEditable}
      onContentChange={handleContentChange}
      onElementSelect={handleElementSelect}
      templateId={templateId}
      isMobile={isMobile}
      currentPage={currentPageIndex}
      totalPages={totalPages}
    />
  );
};

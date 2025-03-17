import { useWindowSize } from "@/hooks/useWindowSize";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast"; 
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { useTemplateStyles } from "@/hooks/useTemplateStyles";
import { DesignerStandaloneView } from "@/components/designer/core/DesignerStandaloneView";
import { EditorView } from "@/components/editor/EditorView";

interface DesignPanelProps {
  content: string;
  isEditable: boolean;
  templateId?: string;
}

export const DesignPanel = ({ content, isEditable, templateId }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  
  const [designContent, setDesignContent] = useState(content);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const { customStyles, handleStylesChange } = useTemplateStyles(templateId);
  
  if (content !== designContent && !isEditable) {
    setDesignContent(content);
  }
  
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
  
  const editorSetup = isEditable && isStandalone ? 
    useEditorSetup({ 
      content: designContent, 
      onContentChange: handleContentChange,
      isEditable 
    }) : null;
  
  if (isStandalone) {
    return (
      <DesignerStandaloneView
        content={content}
        designContent={designContent}
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
      content={designContent}
      customStyles={customStyles}
      isEditable={isEditable}
      onContentChange={handleContentChange}
      onElementSelect={handleElementSelect}
      templateId={templateId}
      isMobile={isMobile}
    />
  );
};


import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { TypographyPanel } from "@/components/design/TypographyPanel";
import { textStyleStore } from "@/stores/textStyleStore";
import { useToast } from "@/hooks/use-toast";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  const [designContent, setDesignContent] = useState(content);
  const [customStyles, setCustomStyles] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  // Update local content when prop changes (for when editor updates content)
  if (content !== designContent && !isEditable) {
    setDesignContent(content);
  }
  
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
    
    // Apply styles to the selected element
    Object.entries(styles).forEach(([property, value]) => {
      selectedElement.style[property as any] = value;
    });
  };

  const handleSaveStyle = async (styleData: any) => {
    try {
      await textStyleStore.saveTextStyle(styleData);
      
      // Refresh styles
      const styles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(styles);
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
  
  return (
    <div className={`${isStandalone ? 'w-full' : isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-editor-text">Design Panel</h2>
            {isEditable ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Editable
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                View Only
              </span>
            )}
          </div>
        )}
        
        {role === "designer" && (
          <TypographyPanel 
            selectedElement={selectedElement} 
            onStyleChange={handleStyleChange}
            onSaveStyle={handleSaveStyle}
            onStylesChange={handleStylesChange}
          />
        )}
        
        <DocumentPreview 
          content={designContent}
          customStyles={customStyles}
          isEditable={isEditable}
          onContentChange={handleContentChange}
          onElementSelect={handleElementSelect}
        />
      </div>
    </div>
  );
};

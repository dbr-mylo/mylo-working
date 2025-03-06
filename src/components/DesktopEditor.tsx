
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { ToolSidebar } from "@/components/sidebar/ToolSidebar";
import { ToolPanel } from "@/components/sidebar/ToolPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { TypographyPanel } from "@/components/design/TypographyPanel";
import { TemplateControls } from "@/components/design/TemplateControls";

type DesktopEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
};

export const DesktopEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable 
}: DesktopEditorProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [customStyles, setCustomStyles] = useState<string>("");
  
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

  return (
    <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
      {isDesigner && (
        <ToolSidebar>
          <ToolPanel title="Typography Tools">
            <TypographyPanel 
              selectedElement={selectedElement} 
              onStyleChange={handleStyleChange}
              onStylesChange={handleStylesChange}
            />
          </ToolPanel>
          <ToolPanel title="Design Templates">
            <TemplateControls onStylesChange={handleStylesChange} />
          </ToolPanel>
          <ToolPanel title="Color Palette">
            <p className="text-sm text-gray-500">Color palette tools appear here.</p>
          </ToolPanel>
        </ToolSidebar>
      )}
      
      <EditorPanel 
        content={content}
        onContentChange={onContentChange}
        isEditable={isEditorEditable}
      />
      
      <DesignPanel 
        content={content}
        isEditable={isDesignEditable}
        onElementSelect={handleElementSelect}
        customStyles={customStyles}
      />
    </main>
  );
};


import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { ToolSidebar } from "@/components/sidebar/ToolSidebar";
import { ToolPanel } from "@/components/sidebar/ToolPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { TypographyPanel } from "@/components/design/TypographyPanel";
import { TemplateControls } from "@/components/design/TemplateControls";
import { toast } from "sonner";

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
  
  // Debug the role to see if it's correctly set
  useEffect(() => {
    console.log("Current user role:", role);
  }, [role]);
  
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

  // Display a message if the user is not a designer
  useEffect(() => {
    if (role && role !== "designer") {
      toast("Designer tools are only available for users with designer role", {
        description: "Your current role: " + role
      });
    }
  }, [role]);

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

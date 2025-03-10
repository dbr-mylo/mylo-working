
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { useState } from "react";
import { TextStyle } from "@/lib/types";
import { PlusIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StylesList } from "./typography/StylesList";
import { StyleEditorModal } from "./typography/StyleEditorModal";
import { Editor } from "@tiptap/react";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

interface DesignerSidebarProps {
  children?: React.ReactNode;
  editorInstance?: Editor | null;
}

export const DesignerSidebar = ({ children, editorInstance }: DesignerSidebarProps) => {
  const [isStyleEditorOpen, setIsStyleEditorOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);
  const { toast } = useToast();

  const handleNewStyle = () => {
    setSelectedStyle(null); // Clear any selected style
    setIsStyleEditorOpen(true);
  };

  const handleEditStyle = (style: TextStyle) => {
    setSelectedStyle(style);
    setIsStyleEditorOpen(true);
  };

  const handleStyleSaved = () => {
    // Force refresh of the styles list
    setSelectedStyle(null);
  };
  
  const handleResetStyles = () => {
    try {
      textStyleStore.resetTextStylesToDefaults();
      toast({
        title: "Styles reset",
        description: "All styles have been reset to defaults"
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error resetting styles:", error);
      toast({
        title: "Error",
        description: "Failed to reset styles",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-64 bg-editor-sidebar border-l border-editor-border p-4">
      {children}
      
      <DesignerSidebarContainer 
        title="Styles" 
        menuOptions={[
          { label: "New Style", onClick: handleNewStyle },
          { label: "Reset Styles", onClick: handleResetStyles }
        ]}
      >
        <div className="mb-2 flex gap-2">
          <Button 
            variant="outline" 
            size="xs" 
            className="flex-1 justify-start" 
            onClick={handleNewStyle}
          >
            <PlusIcon className="h-3 w-3 mr-2" />
            <span className="text-xs">New Style</span>
          </Button>
          
          <Button
            variant="outline"
            size="xs"
            className="px-2"
            onClick={handleResetStyles}
            title="Reset styles to defaults"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        
        <StylesList 
          onEditStyle={handleEditStyle} 
          editorInstance={editorInstance} 
        />
      </DesignerSidebarContainer>
      
      <StyleEditorModal
        style={selectedStyle}
        isOpen={isStyleEditorOpen}
        onClose={() => setIsStyleEditorOpen(false)}
        onStyleSaved={handleStyleSaved}
      />
      
      <DesignerSidebarContainer title="Settings">
        <p className="text-xs text-editor-text">No settings available yet</p>
      </DesignerSidebarContainer>
    </div>
  );
}

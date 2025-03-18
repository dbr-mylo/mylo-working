
import { DesignerSidebarContainer } from "@/components/designer/core/DesignerSidebarContainer";
import { useState } from "react";
import { TextStyle } from "@/lib/types";
import { PlusIcon, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StylesList } from "@/components/designer/typography/StylesList";
import { TestStyleEditorModal } from "@/components/design/typography/TestStyleEditorModal";
import { Editor } from "@tiptap/react";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  
  const handleDeepClean = () => {
    try {
      textStyleStore.deepCleanStorage();
      toast({
        title: "Storage cleaned",
        description: "All caches and stored styles have been cleared"
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error cleaning storage:", error);
      toast({
        title: "Error",
        description: "Failed to clean storage",
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
          { label: "Reset Styles", onClick: handleResetStyles },
          { label: "Deep Clean", onClick: handleDeepClean }
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className="px-2"
                title="Clean all caches and reset styles"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clean all style caches?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all stored styles and reset to defaults. This action is useful
                  when you encounter persistent style issues or duplicates.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeepClean}>
                  Clean All Caches
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
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
      
      {/* Using TestStyleEditorModal instead of StyleEditorModal */}
      <TestStyleEditorModal
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

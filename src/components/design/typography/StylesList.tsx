import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useToast } from "@/hooks/use-toast";
import { resetTextStylesToDefaults } from "@/stores/textStyles/styleCache";
import { StyleListItemCard } from "./StyleListItemCard";
import { useStyleContextMenu } from "./hooks/useStyleContextMenu";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
  editorInstance?: Editor | null;
}

export const StylesList = ({ onEditStyle, editorInstance }: StylesListProps) => {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up the style application hook if we have an editor instance
  const styleApplication = editorInstance 
    ? useStyleApplication(editorInstance) 
    : null;

  // Use the context menu hook
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useStyleContextMenu();

  // Function to deduplicate styles by name
  const deduplicateStyles = (styles: TextStyle[]): TextStyle[] => {
    const uniqueStylesMap = new Map<string, TextStyle>();
    
    // Keep only the most recently updated style with a given name
    styles.forEach(style => {
      const existingStyle = uniqueStylesMap.get(style.name);
      if (!existingStyle || (style.updated_at && existingStyle.updated_at && style.updated_at > existingStyle.updated_at)) {
        uniqueStylesMap.set(style.name, style);
      }
    });
    
    return Array.from(uniqueStylesMap.values());
  };

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        setIsLoading(true);
        const styles = await textStyleStore.getTextStyles();
        
        // Filter out any system styles or unwanted default reset styles
        let filteredStyles = styles.filter(style => 
          !style.name.includes("Clear to Default") && 
          !style.name.includes("Reset")
        );
        
        // Deduplicate styles by name
        filteredStyles = deduplicateStyles(filteredStyles);
        
        // Log the styles we found for debugging
        console.log('Available text styles:', filteredStyles.map(s => 
          `${s.name} (isDefault: ${s.isDefault}, isUsed: ${s.isUsed})`
        ).join(', '));
        
        setTextStyles(filteredStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        toast({
          title: "Error loading styles",
          description: "Could not load text styles properly. Trying to reset...",
          variant: "destructive"
        });
        
        // Try to reset the styles to defaults
        resetTextStylesToDefaults();
        
        // Try to load the styles again
        try {
          const defaultStyles = await textStyleStore.getTextStyles();
          setTextStyles(defaultStyles);
        } catch (innerError) {
          console.error("Error loading default text styles:", innerError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTextStyles();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      setTextStyles(textStyles.filter((style) => style.id !== id));
    } catch (error) {
      console.error("Error deleting style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = async (style: TextStyle) => {
    try {
      const newStyle = await textStyleStore.duplicateTextStyle(style.id);
      setTextStyles([...textStyles, newStyle]);
    } catch (error) {
      console.error("Error duplicating style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleStyleClick = async (style: TextStyle) => {
    console.log("Style clicked in sidebar:", style.name);
    console.log("Editor has selection:", editorInstance && !editorInstance.state.selection.empty);
    
    // Check if we have an editor and if there's a selection
    if (editorInstance && styleApplication && !editorInstance.state.selection.empty) {
      // Apply the style to the selected text
      try {
        console.log("Applying style to selection:", style.id);
        await styleApplication.applyStyleToSelection(style.id);
        toast({
          title: "Style applied",
          description: `Applied "${style.name}" to selected text`
        });
      } catch (error) {
        console.error("Error applying style from sidebar:", error);
        toast({
          title: "Error applying style",
          description: "Could not apply the style to the selected text",
          variant: "destructive"
        });
      }
    } else {
      // If no text is selected or no editor instance, open the style editor
      console.log("No selection or no editor, opening style editor");
      onEditStyle(style);
    }
  };

  if (isLoading) {
    return <p className="text-xs text-editor-text py-1">Loading styles...</p>;
  }

  if (textStyles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-0.5">
      {textStyles.map((style) => (
        <StyleListItemCard
          key={style.id}
          style={style}
          onClick={() => handleStyleClick(style)}
          onContextMenu={(e) => handleContextMenu(e, style)}
        />
      ))}

      {contextMenu && (
        <StyleContextMenu
          style={contextMenu.style}
          onEdit={onEditStyle}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

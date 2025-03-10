
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useToast } from "@/hooks/use-toast";

export const useStylesList = (
  onEditStyle: (style: TextStyle) => void,
  editorInstance?: Editor | null
) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    style: TextStyle;
    position: { x: number; y: number };
  } | null>(null);
  const { toast } = useToast();
  
  // Set up the style application hook if we have an editor instance
  const styleApplication = editorInstance 
    ? useStyleApplication(editorInstance) 
    : null;

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        // Show all styles together without separating default style
        setStyles(fetchedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTextStyles();
  }, []);

  const handleContextMenu = (
    e: React.MouseEvent,
    style: TextStyle
  ) => {
    e.preventDefault();
    setContextMenu({
      style,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      setStyles(styles.filter((style) => style.id !== id));
    } catch (error) {
      console.error("Error deleting style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = async (style: TextStyle) => {
    try {
      const newStyle = await textStyleStore.duplicateTextStyle(style.id);
      setStyles([...styles, newStyle]);
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

  return {
    isLoading,
    styles,
    contextMenu,
    handleStyleClick,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate
  };
};


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
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
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
        const styles = await textStyleStore.getTextStyles();
        setTextStyles(styles);
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

  const handleSetDefault = async (id: string) => {
    try {
      await textStyleStore.setDefaultStyle(id);
      // Reload styles to get updated default flags
      const styles = await textStyleStore.getTextStyles();
      setTextStyles(styles);
    } catch (error) {
      console.error("Error setting default style:", error);
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

  // Find default style and other styles
  const defaultStyle = textStyles.find(style => style.isDefault);
  // Filter out the default style from the main list
  const otherStyles = textStyles.filter(style => !style.isDefault);

  return {
    isLoading,
    defaultStyle,
    otherStyles,
    contextMenu,
    handleStyleClick,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate,
    handleSetDefault
  };
};


import { useState, useEffect, useMemo } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useToast } from "@/hooks/use-toast";

export const useStylesList = (
  onEditStyle: (style: TextStyle) => void,
  editorInstance?: Editor | null
) => {
  const [userStyles, setUserStyles] = useState<TextStyle[]>([]);
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

  // Create a persistent Default Text style that's always available
  const defaultTextStyle: TextStyle = useMemo(() => ({
    id: 'default-text-reset',
    name: 'Default Text',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'span, div',
    description: 'Reset to default text formatting',
    isSystem: true,
    isPersistent: true, // New flag to indicate this is a special style
    isUsed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }), []);

  // Combine user styles with the persistent default text style
  const styles = useMemo(() => {
    return [defaultTextStyle, ...userStyles];
  }, [defaultTextStyle, userStyles]);

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        // Set user styles without adding the default text style (which is added separately)
        setUserStyles(fetchedStyles);
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
    // Don't allow context menu on the persistent default text style
    if (style.isPersistent) return;
    
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
      setUserStyles(userStyles.filter((style) => style.id !== id));
    } catch (error) {
      console.error("Error deleting style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = async (style: TextStyle) => {
    try {
      const newStyle = await textStyleStore.duplicateTextStyle(style.id);
      setUserStyles([...userStyles, newStyle]);
    } catch (error) {
      console.error("Error duplicating style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const applyDefaultTextStyle = async () => {
    if (!editorInstance || !styleApplication) {
      // If no editor instance or no text selected, just open the style editor
      return;
    }

    try {
      // Get the actual default style from the store
      const defaultStyle = await textStyleStore.getDefaultStyle();
      
      // Clear all existing formatting
      editorInstance.chain()
        .focus()
        .unsetAllMarks()
        .setFontFamily(null)
        .setFontSize(null)
        .setColor(null)
        .run();
        
      // If we have a default style, apply it
      if (defaultStyle) {
        // Apply default style properties
        editorInstance.chain()
          .focus()
          .setFontFamily(defaultStyle.fontFamily || 'Inter')
          .setFontSize(defaultStyle.fontSize || '16px')
          .setColor(defaultStyle.color || '#000000')
          .run();
          
        toast({
          title: "Default style applied",
          description: "Text has been reset to default formatting"
        });
      }
    } catch (error) {
      console.error('Error applying default style:', error);
      toast({
        title: "Error applying default style",
        description: "Could not reset text formatting",
        variant: "destructive"
      });
    }
  };

  const handleStyleClick = async (style: TextStyle) => {
    console.log("Style clicked in sidebar:", style.name);
    
    // Special handling for the Default Text style
    if (style.id === 'default-text-reset') {
      console.log("Applying default text formatting");
      await applyDefaultTextStyle();
      return;
    }
    
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
      // But don't open editor for the persistent default text style
      if (!style.isPersistent) {
        console.log("No selection or no editor, opening style editor");
        onEditStyle(style);
      } else if (editorInstance) {
        // If it's the persistent style and we have an editor but no selection,
        // inform the user to select text first
        toast({
          title: "No text selected",
          description: "Please select some text to apply the default style"
        });
      }
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

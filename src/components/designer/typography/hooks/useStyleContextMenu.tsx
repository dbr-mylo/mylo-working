
import { useState, useCallback } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

type StyleContextMenuProps = {
  onEditStyle: (style: TextStyle) => void;
  applyStyle?: (styleId: string) => void;
};

export const useStyleContextMenu = ({
  onEditStyle,
  applyStyle
}: StyleContextMenuProps) => {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedStyleForMenu, setSelectedStyleForMenu] = useState<TextStyle | null>(null);
  const { toast } = useToast();
  
  const handleContextMenu = useCallback((e: React.MouseEvent, style: TextStyle) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedStyleForMenu(style);
    setShowContextMenu(true);
  }, []);
  
  const handleCloseContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, []);
  
  const duplicateStyle = useCallback(async (style: TextStyle) => {
    try {
      // Create a copy with a new name
      const duplicate = {
        ...style,
        id: undefined, // Clear ID to create a new entry
        name: `${style.name} (Copy)`
      };
      
      await textStyleStore.saveTextStyle(duplicate);
      
      toast({
        title: "Style duplicated",
        description: `Created copy of "${style.name}"`,
      });
    } catch (error) {
      console.error("Error duplicating style:", error);
      toast({
        title: "Duplication failed",
        description: "Could not duplicate the style",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const deleteStyle = useCallback(async (styleId: string) => {
    try {
      await textStyleStore.deleteTextStyle(styleId);
      
      toast({
        title: "Style deleted",
        description: "The style has been deleted",
      });
    } catch (error) {
      console.error("Error deleting style:", error);
      toast({
        title: "Deletion failed", 
        description: "Could not delete the style",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  return {
    contextMenuPosition,
    showContextMenu,
    selectedStyleForMenu,
    handleContextMenu,
    handleCloseContextMenu,
    duplicateStyle,
    deleteStyle
  };
};

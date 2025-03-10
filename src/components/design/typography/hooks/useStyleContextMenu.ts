
import { useState } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

export const useStyleContextMenu = (
  userStyles: TextStyle[],
  setUserStyles: React.Dispatch<React.SetStateAction<TextStyle[]>>
) => {
  const [contextMenu, setContextMenu] = useState<{
    style: TextStyle;
    position: { x: number; y: number };
  } | null>(null);

  const handleContextMenu = (
    e: React.MouseEvent,
    style: TextStyle
  ) => {
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

  return {
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate
  };
};

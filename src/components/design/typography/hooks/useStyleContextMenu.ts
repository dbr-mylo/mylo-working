
import { useState } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

export const useStyleContextMenu = (
  userStyles: TextStyle[],
  setUserStyles: React.Dispatch<React.SetStateAction<TextStyle[]>>
) => {
  const [contextMenu, setContextMenu] = useState<{
    style: TextStyle;
    x: number;
    y: number;
    isOpen: boolean;
  }>({
    style: {} as TextStyle,
    x: 0,
    y: 0,
    isOpen: false
  });
  
  const [defaultFontModalOpen, setDefaultFontModalOpen] = useState(false);

  const handleContextMenu = (
    e: React.MouseEvent,
    style: TextStyle
  ) => {
    e.preventDefault();
    setContextMenu({
      style,
      x: e.clientX,
      y: e.clientY,
      isOpen: true
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({
      ...prev,
      isOpen: false
    }));
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
  
  const handleOpenDefaultFontModal = () => {
    setDefaultFontModalOpen(true);
  };
  
  const handleCloseDefaultFontModal = () => {
    setDefaultFontModalOpen(false);
  };

  return {
    contextMenu,
    defaultFontModalOpen,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate,
    handleOpenDefaultFontModal,
    handleCloseDefaultFontModal
  };
};

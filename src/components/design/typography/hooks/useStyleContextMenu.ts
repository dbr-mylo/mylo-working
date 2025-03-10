
import { useState } from "react";
import { TextStyle } from "@/lib/types";

interface ContextMenu {
  style: TextStyle;
  position: { x: number; y: number };
}

export const useStyleContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

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

  return {
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu
  };
};

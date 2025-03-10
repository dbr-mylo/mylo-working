
import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";
import { StyleContextMenu } from "./StyleContextMenu";
import { DefaultFontModal } from "./DefaultFontModal";
import { useState } from "react";

interface DefaultStyleSectionProps {
  defaultStyle: TextStyle;
  onStyleClick: (style: TextStyle) => void;
  onContextMenu: (e: React.MouseEvent, style: TextStyle) => void;
}

export const DefaultStyleSection = ({ 
  defaultStyle, 
  onStyleClick, 
  onContextMenu 
}: DefaultStyleSectionProps) => {
  const [defaultFontModalOpen, setDefaultFontModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    isOpen: false
  });
  
  if (!defaultStyle) return null;
  
  const handleOpenDefaultFontModal = () => {
    setDefaultFontModalOpen(true);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };
  
  const handleContextMenu = (e: React.MouseEvent, style: TextStyle) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true
    });
    
    // Also call the parent's onContextMenu
    onContextMenu(e, style);
  };
  
  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <div className="mb-3">
      <StyleListItemCard
        style={defaultStyle}
        onStyleClick={onStyleClick}
        onContextMenu={handleContextMenu}
        isDefaultStyleSection={true}
      />
      
      {/* Context menu for default style */}
      <StyleContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        style={defaultStyle}
        onEdit={() => {}}
        onDelete={() => {}}
        onDuplicate={() => {}}
        onClose={handleCloseContextMenu}
        onDefaultFontChange={handleOpenDefaultFontModal}
      />
      
      {/* Modal for changing default font */}
      <DefaultFontModal 
        isOpen={defaultFontModalOpen}
        onClose={() => setDefaultFontModalOpen(false)}
        defaultStyle={defaultStyle}
      />
    </div>
  );
};

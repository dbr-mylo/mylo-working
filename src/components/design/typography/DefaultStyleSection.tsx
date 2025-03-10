
import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";
import { StyleContextMenu } from "./StyleContextMenu";
import { DefaultFontModal } from "./DefaultFontModal";
import { useStyleContextMenu } from "./hooks/useStyleContextMenu";
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
  
  if (!defaultStyle) return null;
  
  const handleOpenDefaultFontModal = () => {
    setDefaultFontModalOpen(true);
  };
  
  return (
    <div className="mb-3">
      <StyleListItemCard
        style={defaultStyle}
        onStyleClick={onStyleClick}
        onContextMenu={onContextMenu}
        isDefaultStyleSection={true}
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

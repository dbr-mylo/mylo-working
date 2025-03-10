
import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";

interface DefaultStyleSectionProps {
  style: TextStyle;
  onStyleClick: (style: TextStyle) => void;
  onContextMenu: (e: React.MouseEvent, style: TextStyle) => void;
}

export const DefaultStyleSection = ({ 
  style, 
  onStyleClick, 
  onContextMenu 
}: DefaultStyleSectionProps) => {
  if (!style) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium text-editor-heading mb-1.5">Default Style</h4>
      <StyleListItemCard
        style={style}
        onStyleClick={onStyleClick}
        onContextMenu={onContextMenu}
        isDefaultStyleSection={true}
      />
    </div>
  );
};

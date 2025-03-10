
import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";

interface DefaultStyleSectionProps {
  defaultStyle: TextStyle | undefined;
  onStyleClick: (style: TextStyle) => void;
  onContextMenu: (e: React.MouseEvent, style: TextStyle) => void;
}

export const DefaultStyleSection = ({ 
  defaultStyle, 
  onStyleClick, 
  onContextMenu 
}: DefaultStyleSectionProps) => {
  if (!defaultStyle) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium text-editor-heading mb-1.5">Default Style</h4>
      <StyleListItemCard
        style={defaultStyle}
        onStyleClick={onStyleClick}
        onContextMenu={onContextMenu}
        isDefaultStyleSection={true}
      />
    </div>
  );
};


import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";

interface DefaultStyleSectionProps {
  defaultStyle: TextStyle;
  onStyleClick: (style: TextStyle) => void;
}

export const DefaultStyleSection = ({ 
  defaultStyle, 
  onStyleClick 
}: DefaultStyleSectionProps) => {
  if (!defaultStyle) return null;
  
  return (
    <div className="mb-3">
      <StyleListItemCard
        style={defaultStyle}
        onStyleClick={onStyleClick}
        isDefaultStyleSection={true}
      />
    </div>
  );
};

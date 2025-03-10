
import { TextStyle } from "@/lib/types";
import { StyleListItemCard } from "./StyleListItemCard";

interface OtherStylesSectionProps {
  styles: TextStyle[];
  onStyleClick: (style: TextStyle) => void;
  onContextMenu: (e: React.MouseEvent, style: TextStyle) => void;
}

export const OtherStylesSection = ({ 
  styles, 
  onStyleClick, 
  onContextMenu 
}: OtherStylesSectionProps) => {
  return (
    <>
      <h4 className="text-xs font-medium text-editor-heading mb-1.5">Text Styles</h4>
      <div className="space-y-0.5">
        {styles.map((style) => (
          <StyleListItemCard
            key={style.id}
            style={style}
            onStyleClick={onStyleClick}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </>
  );
};

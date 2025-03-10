
import { Card } from "@/components/ui/card";
import { TextStyle } from "@/lib/types";
import { MoreHorizontal, Check } from "lucide-react";
import { StyleListItem } from "./StyleListItem";

interface StyleListItemCardProps {
  style: TextStyle;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const StyleListItemCard = ({ style, onClick, onContextMenu }: StyleListItemCardProps) => {
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContextMenu(e);
  };

  // Wrapper function to handle the style selection from StyleListItem
  const handleStyleSelect = () => {
    onClick();
  };

  return (
    <Card
      className="p-1 hover:bg-accent cursor-pointer"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <StyleListItem 
            style={style}
            onSelect={handleStyleSelect}
            compact={true}
          />
        </div>
        
        <div className="flex items-center space-x-1 ml-1">
          {style.isUsed && (
            <span
              className="text-[10px] text-green-500 flex items-center"
              title="This style is used in documents"
            >
              <Check className="h-3 w-3" />
            </span>
          )}
          {style.isDefault && (
            <span
              className="text-[10px] text-blue-500"
              title="Default style"
            >
              Default
            </span>
          )}
          <button
            onClick={handleOptionsClick}
            className="h-5 w-5 inline-flex items-center justify-center rounded-sm hover:bg-muted"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { TextStyle } from "@/lib/types";
import { Check, Pilcrow, MoreHorizontal } from "lucide-react";

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

  return (
    <Card
      className="p-1 hover:bg-accent cursor-pointer"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center gap-1.5">
        <Pilcrow className="h-3 w-3 text-muted-foreground" />
        <span 
          className="text-xs"
          style={{
            fontFamily: style.fontFamily || 'inherit',
            fontWeight: style.fontWeight || 'inherit'
          }}
        >
          {style.name}
        </span>

        <div className="flex ml-auto items-center space-x-1">
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

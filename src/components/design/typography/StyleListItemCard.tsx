
import { Card } from "@/components/ui/card";
import { TextStyle } from "@/lib/types";
import { Check, Pilcrow, MoreHorizontal, Eraser } from "lucide-react";

interface StyleListItemCardProps {
  style: TextStyle;
  onStyleClick: (style: TextStyle) => void;
  onContextMenu: (e: React.MouseEvent, style: TextStyle) => void;
  isDefaultStyleSection?: boolean;
}

export const StyleListItemCard = ({ 
  style, 
  onStyleClick, 
  onContextMenu,
  isDefaultStyleSection
}: StyleListItemCardProps) => {
  const isPersistentDefaultStyle = style.isPersistent && style.id === 'default-text-reset';

  return (
    <Card
      key={style.id}
      className={`p-1.5 hover:bg-accent cursor-pointer ${isDefaultStyleSection ? 'bg-slate-50' : ''} ${isPersistentDefaultStyle ? 'bg-gray-50 border-dashed' : ''}`}
      onClick={() => onStyleClick(style)}
    >
      <div className="flex items-center gap-1.5">
        {isPersistentDefaultStyle ? (
          <Eraser className="h-3 w-3 text-muted-foreground" />
        ) : (
          <Pilcrow className="h-3 w-3 text-muted-foreground" />
        )}
        <span className="text-xs">
          {style.name}
        </span>

        <div className="flex ml-auto items-center space-x-1">
          {style.isUsed && !isPersistentDefaultStyle && (
            <span
              className="text-[10px] text-green-500 flex items-center"
              title="This style is used in documents"
            >
              <Check className="h-3 w-3" />
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu(e, style);
            }}
            className="h-5 w-5 inline-flex items-center justify-center rounded-sm hover:bg-muted"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
};

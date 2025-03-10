
import { useEffect, useRef, useState } from "react";
import { TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Copy, Trash, Edit, Settings } from "lucide-react";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export interface StyleContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  style: TextStyle;
  onEdit: (style: TextStyle) => void;
  onDelete: (id: string) => void;
  onDuplicate: (style: TextStyle) => void;
  onClose: () => void;
  onDefaultFontChange?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const StyleContextMenu = ({
  x,
  y,
  isOpen,
  style,
  onEdit,
  onDelete,
  onDuplicate,
  onClose,
  onDefaultFontChange,
  containerRef
}: StyleContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen || !style) return null;

  const handleEditClick = () => {
    onEdit(style);
    onClose();
  };

  const handleDuplicateClick = () => {
    onDuplicate(style);
  };

  const handleDeleteClick = () => {
    onDelete(style.id);
  };

  const handleChangeFontClick = () => {
    if (onDefaultFontChange) {
      onDefaultFontChange();
      onClose();
    }
  };

  const adjustedPosition = {
    x: Math.min(x, window.innerWidth - 200),
    y: Math.min(y, window.innerHeight - 200),
  };

  const isDefaultStyle = style.id === 'default-text-reset';

  return (
    <div
      ref={menuRef}
      className="fixed z-50 shadow-md"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      <Card className="w-48 p-1 text-xs">
        {isDefaultStyle ? (
          <button
            className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
            onClick={handleChangeFontClick}
          >
            <Settings className="h-3.5 w-3.5" />
            Change Default Font
          </button>
        ) : (
          <>
            <button
              className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
              onClick={handleEditClick}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Style
            </button>
            <button
              className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
              onClick={handleDuplicateClick}
              disabled={style.isSystem}
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
            <hr className="my-1" />
            <button
              className="w-full text-left px-2 py-1.5 hover:bg-accent text-destructive rounded flex items-center gap-2"
              onClick={handleDeleteClick}
              disabled={style.isSystem || style.isDefault}
            >
              <Trash className="h-3.5 w-3.5" />
              Delete
            </button>
          </>
        )}
      </Card>
    </div>
  );
};

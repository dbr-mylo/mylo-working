
import { useEffect, useRef } from "react";
import { StyleContextMenuProps, TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Copy, Trash, Edit } from "lucide-react";

export const StyleContextMenu = ({
  style,
  onEdit,
  onDelete,
  onDuplicate,
  position,
  onClose,
}: StyleContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

  if (!position) return null;

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

  // Adjust position if menu would go off screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200),
    y: Math.min(position.y, window.innerHeight - 200),
  };

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
      </Card>
    </div>
  );
};

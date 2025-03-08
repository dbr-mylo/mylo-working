
import { useEffect, useRef } from "react";
import { StyleContextMenuProps, TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Copy, Trash, Check, Edit } from "lucide-react";

export const StyleContextMenu = ({
  style,
  onEdit,
  onDelete,
  onDuplicate,
  onSetDefault,
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

  const handleSetDefaultClick = () => {
    onSetDefault(style.id);
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
      <Card className="w-48 p-1 text-sm">
        <button
          className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
          Edit Style
        </button>
        <button
          className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
          onClick={handleDuplicateClick}
          disabled={style.isSystem}
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
        <button
          className="w-full text-left px-2 py-1.5 hover:bg-accent rounded flex items-center gap-2"
          onClick={handleSetDefaultClick}
          disabled={style.isDefault}
        >
          <Check className="h-4 w-4" />
          Set as Default
        </button>
        <hr className="my-1" />
        <button
          className="w-full text-left px-2 py-1.5 hover:bg-accent text-destructive rounded flex items-center gap-2"
          onClick={handleDeleteClick}
          disabled={style.isSystem || style.isDefault}
        >
          <Trash className="h-4 w-4" />
          Delete
        </button>
      </Card>
    </div>
  );
};

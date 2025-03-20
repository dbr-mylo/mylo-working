
import React, { useEffect, useRef } from "react";
import { TextStyle } from "@/lib/types";
import { Copy, Edit, Trash2, Paintbrush } from "lucide-react";

interface StyleContextMenuProps {
  style: TextStyle;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onApply: () => void;
}

export const StyleContextMenu = ({
  style,
  position,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onApply
}: StyleContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Menu items
  const menuItems = [
    { icon: <Paintbrush className="h-3.5 w-3.5" />, label: "Apply Style", onClick: onApply },
    { icon: <Edit className="h-3.5 w-3.5" />, label: "Edit", onClick: onEdit },
    { icon: <Copy className="h-3.5 w-3.5" />, label: "Duplicate", onClick: onDuplicate },
    { icon: <Trash2 className="h-3.5 w-3.5 text-destructive" />, label: "Delete", onClick: onDelete, danger: true }
  ];

  return (
    <div
      ref={menuRef}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: "fixed",
        zIndex: 50,
      }}
      className="bg-white shadow-md rounded-md border border-gray-200 py-1 min-w-[160px]"
    >
      {/* Style name header */}
      <div className="px-2 py-1 border-b border-gray-100 mb-1">
        <p className="text-xs font-medium truncate" title={style.name}>
          {style.name}
        </p>
      </div>
      
      {/* Menu items */}
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
            }}
            className={`w-full px-2 py-1 text-left text-xs flex items-center gap-2 hover:bg-gray-100 ${
              item.danger ? "text-destructive hover:bg-destructive/10" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

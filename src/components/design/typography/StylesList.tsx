
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Check, Pilcrow, MoreHorizontal } from "lucide-react";
import { textStyleStore } from "@/stores/textStyles";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
}

export const StylesList = ({ onEditStyle }: StylesListProps) => {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    style: TextStyle;
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        const styles = await textStyleStore.getTextStyles();
        setTextStyles(styles);
      } catch (error) {
        console.error("Error loading text styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTextStyles();
  }, []);

  const handleContextMenu = (
    e: React.MouseEvent,
    style: TextStyle
  ) => {
    e.preventDefault();
    setContextMenu({
      style,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      setTextStyles(textStyles.filter((style) => style.id !== id));
    } catch (error) {
      console.error("Error deleting style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = async (style: TextStyle) => {
    try {
      const newStyle = await textStyleStore.duplicateTextStyle(style.id);
      setTextStyles([...textStyles, newStyle]);
    } catch (error) {
      console.error("Error duplicating style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await textStyleStore.setDefaultStyle(id);
      // Reload styles to get updated default flags
      const styles = await textStyleStore.getTextStyles();
      setTextStyles(styles);
    } catch (error) {
      console.error("Error setting default style:", error);
    } finally {
      handleCloseContextMenu();
    }
  };

  if (isLoading) {
    return <p className="text-xs text-editor-text py-1">Loading styles...</p>;
  }

  if (textStyles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-0.5">
      {textStyles.map((style) => (
        <Card
          key={style.id}
          className="p-1 hover:bg-accent cursor-pointer"
          onClick={() => onEditStyle(style)}
          onContextMenu={(e) => handleContextMenu(e, style)}
        >
          <div className="flex items-center gap-1.5">
            <Pilcrow className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{style.name}</span>

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
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e, style);
                }}
                className="h-5 w-5 inline-flex items-center justify-center rounded-sm hover:bg-muted"
              >
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      {contextMenu && (
        <StyleContextMenu
          style={contextMenu.style}
          onEdit={onEditStyle}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onSetDefault={handleSetDefault}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

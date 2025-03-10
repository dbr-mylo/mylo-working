
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Check, Pilcrow, MoreHorizontal } from "lucide-react";
import { textStyleStore } from "@/stores/textStyles";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useToast } from "@/hooks/use-toast";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
  editorInstance?: Editor | null;
}

export const StylesList = ({ onEditStyle, editorInstance }: StylesListProps) => {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    style: TextStyle;
    position: { x: number; y: number };
  } | null>(null);
  const { toast } = useToast();
  
  // Set up the style application hook if we have an editor instance
  const styleApplication = editorInstance 
    ? useStyleApplication(editorInstance) 
    : null;

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

  const handleStyleClick = async (style: TextStyle) => {
    console.log("Style clicked in sidebar:", style.name);
    console.log("Editor has selection:", editorInstance && !editorInstance.state.selection.empty);
    
    // Check if we have an editor and if there's a selection
    if (editorInstance && styleApplication && !editorInstance.state.selection.empty) {
      // Apply the style to the selected text
      try {
        console.log("Applying style to selection:", style.id);
        await styleApplication.applyStyleToSelection(style.id);
        toast({
          title: "Style applied",
          description: `Applied "${style.name}" to selected text`
        });
      } catch (error) {
        console.error("Error applying style from sidebar:", error);
        toast({
          title: "Error applying style",
          description: "Could not apply the style to the selected text",
          variant: "destructive"
        });
      }
    } else {
      // If no text is selected or no editor instance, open the style editor
      console.log("No selection or no editor, opening style editor");
      onEditStyle(style);
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
          onClick={() => handleStyleClick(style)}
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

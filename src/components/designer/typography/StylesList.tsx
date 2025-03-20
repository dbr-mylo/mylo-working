
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useToast } from "@/hooks/use-toast";
import { StyleListItemCard } from "./StyleListItemCard";
import { useStyleContextMenu } from "./hooks/useStyleContextMenu";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
  editorInstance?: Editor | null;
}

export const StylesList = ({ onEditStyle, editorInstance }: StylesListProps) => {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up the style application hook if we have an editor instance
  const { applyStyle } = useStyleApplication(editorInstance);
  
  // Set up the context menu
  const { 
    contextMenuPosition,
    showContextMenu,
    selectedStyleForMenu,
    handleContextMenu,
    handleCloseContextMenu,
    duplicateStyle,
    deleteStyle
  } = useStyleContextMenu({
    onEditStyle,
    applyStyle
  });
  
  // Load text styles
  useEffect(() => {
    const loadStyles = async () => {
      try {
        setIsLoading(true);
        const styles = await textStyleStore.getTextStyles();
        setTextStyles(styles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        toast({
          title: "Error loading styles",
          description: "Could not load text styles",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStyles();
  }, [toast]);
  
  const handleStyleClick = (style: TextStyle) => {
    // If we have an editor, apply the style
    if (editorInstance && applyStyle) {
      applyStyle(style.id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-4 text-center text-xs text-editor-text">
        Loading styles...
      </div>
    );
  }
  
  if (textStyles.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-1">
      {textStyles.map((style) => (
        <StyleListItemCard 
          key={style.id}
          style={style}
          onClick={() => handleStyleClick(style)}
          onContextMenu={(e) => handleContextMenu(e, style)}
        />
      ))}
      
      {showContextMenu && selectedStyleForMenu && (
        <StyleContextMenu
          style={selectedStyleForMenu}
          position={contextMenuPosition}
          onClose={handleCloseContextMenu}
          onEdit={() => {
            onEditStyle(selectedStyleForMenu);
            handleCloseContextMenu();
          }}
          onDuplicate={() => {
            duplicateStyle(selectedStyleForMenu);
            handleCloseContextMenu();
          }}
          onDelete={() => {
            deleteStyle(selectedStyleForMenu.id);
            handleCloseContextMenu();
          }}
          onApply={() => {
            if (applyStyle) {
              applyStyle(selectedStyleForMenu.id);
            }
            handleCloseContextMenu();
          }}
        />
      )}
    </div>
  );
};

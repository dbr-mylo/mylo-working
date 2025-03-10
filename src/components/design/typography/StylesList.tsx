
import { TextStyle } from "@/lib/types";
import { Editor } from "@tiptap/react";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";
import { OtherStylesSection } from "./OtherStylesSection";
import { useStylesList } from "./hooks/useStylesList";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
  editorInstance?: Editor | null;
}

export const StylesList = ({ onEditStyle, editorInstance }: StylesListProps) => {
  const {
    isLoading,
    styles,
    contextMenu,
    handleStyleClick,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate
  } = useStylesList(onEditStyle, editorInstance);

  if (isLoading) {
    return <p className="text-xs text-editor-text py-1">Loading styles...</p>;
  }

  if (styles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {/* All Styles Section */}
      <OtherStylesSection 
        styles={styles} 
        onStyleClick={handleStyleClick} 
        onContextMenu={handleContextMenu} 
      />

      {/* Context Menu */}
      {contextMenu && (
        <StyleContextMenu
          style={contextMenu.style}
          onEdit={onEditStyle}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

import { TextStyle } from "@/lib/types";
import { Editor } from "@tiptap/react";
import { EmptyState } from "./EmptyState";
import { StyleContextMenu } from "./StyleContextMenu";
import { DefaultStyleSection } from "./DefaultStyleSection";
import { OtherStylesSection } from "./OtherStylesSection";
import { useStylesList } from "./hooks/useStylesList";

export interface StylesListProps {
  onEditStyle: (style: TextStyle) => void;
  editorInstance?: Editor | null;
}

export const StylesList = ({ onEditStyle, editorInstance }: StylesListProps) => {
  const {
    isLoading,
    defaultStyle,
    otherStyles,
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

  if (!defaultStyle && otherStyles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {/* Default Style Section */}
      <DefaultStyleSection 
        defaultStyle={defaultStyle} 
        onStyleClick={handleStyleClick} 
        onContextMenu={handleContextMenu} 
      />

      {/* Other Styles Section */}
      {otherStyles.length > 0 && (
        <OtherStylesSection 
          styles={otherStyles} 
          onStyleClick={handleStyleClick} 
          onContextMenu={handleContextMenu} 
        />
      )}

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

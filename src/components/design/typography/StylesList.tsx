import React, { useState, useRef } from "react";
import { useStylesList } from "./hooks/useStylesList";
import { EmptyState } from "./EmptyState";
import { DefaultStyleSection } from "./DefaultStyleSection";
import { OtherStylesSection } from "./OtherStylesSection";
import { StyleContextMenu } from "./StyleContextMenu";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@tiptap/react";
import { TextStyle } from "@/lib/types";

interface StylesListProps {
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
    handleDuplicate,
  } = useStylesList(onEditStyle, editorInstance);

  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <div className="py-2">Loading styles...</div>;
  }

  if (!styles || styles.length === 0) {
    return <EmptyState />;
  }

  const defaultStyle = styles.find(s => s.id === 'default-text-reset') || styles[0];
  const otherStyles = styles.filter(s => s.id !== 'default-text-reset' && s.id !== defaultStyle.id);

  return (
    <div className="space-y-4" ref={containerRef}>
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
      <StyleContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={handleCloseContextMenu}
        style={contextMenu.style}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onEdit={onEditStyle}
        containerRef={containerRef}
      />
    </div>
  );
};

import React, { useState, useRef } from "react";
import { useStylesList } from "./hooks/useStylesList";
import { EmptyState } from "./EmptyState";
import { DefaultStyleSection } from "./DefaultStyleSection";
import { OtherStylesSection } from "./OtherStylesSection";
import { StyleContextMenu } from "./StyleContextMenu";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@tiptap/react";
import { TextStyle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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
    saveAsDefaultStyle // This comes from useStylesList now
  } = useStylesList(onEditStyle, editorInstance);

  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <div className="py-2">Loading styles...</div>;
  }

  if (!styles || styles.length === 0) {
    return <EmptyState />;
  }

  // The default style is assumed to be the first one
  const defaultStyle = styles.find(s => s.id === 'default-text-reset') || styles[0];
  const otherStyles = styles.filter(s => s.id !== 'default-text-reset' && s.id !== defaultStyle.id);

  const handleSaveCurrentAsDefault = () => {
    if (!editorInstance) {
      toast({
        title: "No active editor",
        description: "Cannot save default style without an active editor",
        variant: "destructive"
      });
      return;
    }
    
    saveAsDefaultStyle();
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Default Style Section */}
      <DefaultStyleSection 
        style={defaultStyle} 
        onStyleClick={handleStyleClick}
        onContextMenu={handleContextMenu}
      />
      
      {/* Button to save current formatting as default */}
      {editorInstance && (
        <Button 
          variant="outline" 
          size="xs" 
          className="w-full justify-start mt-1 mb-2" 
          onClick={handleSaveCurrentAsDefault}
        >
          <Save className="h-3 w-3 mr-2" />
          <span className="text-xs">Save Current as Default</span>
        </Button>
      )}
      
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
        style={contextMenu.selectedStyle}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onEdit={onEditStyle}
        containerRef={containerRef}
      />
    </div>
  );
};


import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentStyles } from "./preview/DocumentStyles";
import { EditableContent } from "./preview/EditableContent";
import { ViewableContent } from "./preview/ViewableContent";
import { EmptyContent } from "./preview/EmptyContent";
import { SelectedElementBar } from "./preview/SelectedElementBar";
import { useDocumentPreview } from "./preview/useDocumentPreview";

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
  renderToolbarOutside?: boolean;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange,
  onElementSelect,
  renderToolbarOutside = false
}: DocumentPreviewProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  const {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  } = useDocumentPreview(onElementSelect);
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  return (
    <div className="bg-editor-panel p-4 rounded-md">
      {/* Show selection bar only when not editable and has selected element */}
      {!isEditable && selectedElement && (
        <SelectedElementBar 
          selectedElement={selectedElement}
          onApplyStyle={handleApplyStyle}
        />
      )}
      
      <div className="prose prose-sm max-w-none">
        <DocumentStyles customStyles={customStyles} />
        
        {isEditable ? (
          <EditableContent
            content={content}
            onContentChange={handleContentChange}
            hideToolbar={isDesigner}
            renderToolbarOutside={renderToolbarOutside}
          />
        ) : content ? (
          <ViewableContent
            content={content}
            previewRef={previewRef}
            onClick={handlePreviewClick}
          />
        ) : (
          <EmptyContent />
        )}
      </div>
    </div>
  );
};

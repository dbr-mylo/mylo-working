
import React from "react";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { Editor } from "@tiptap/react";
import { DocumentPreviewPane } from "@/components/design/DocumentPreviewPane";
import { DesignerSidebar } from "@/components/design/DesignerSidebar";

interface DesignerContentProps {
  isPreviewVisible: boolean;
  designContent: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
  editor: Editor | null;
}

export const DesignerContent = ({
  isPreviewVisible,
  designContent,
  customStyles,
  isEditable,
  onContentChange,
  onElementSelect,
  editor
}: DesignerContentProps) => {
  return (
    <div className="flex flex-row flex-1">
      <div className={isPreviewVisible ? "w-1/2 bg-editor-panel overflow-auto border-r border-editor-border" : "w-full bg-editor-panel overflow-auto"}>
        <div className="p-4 md:p-8">
          <div className="mx-auto">
            <DocumentPreview 
              content={designContent}
              customStyles={customStyles}
              isEditable={isEditable}
              onContentChange={onContentChange}
              onElementSelect={onElementSelect}
              renderToolbarOutside={true}
              externalToolbar={isEditable}
              editorInstance={editor}
            />
          </div>
        </div>
      </div>
      
      {isPreviewVisible && (
        <DocumentPreviewPane content={designContent} />
      )}
      
      <DesignerSidebar />
    </div>
  );
};

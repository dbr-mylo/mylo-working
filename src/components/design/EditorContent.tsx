
import React from "react";
import { ToolSettingsMenuBar } from "@/components/design/ToolSettingsMenuBar";
import { DocumentPreview } from "@/components/design/DocumentPreview";

interface EditorContentProps {
  isEditable: boolean;
  designContent: string;
  customStyles: string;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
  isMobile: boolean;
  isStandalone: boolean;
}

export const EditorContent = ({
  isEditable,
  designContent,
  customStyles,
  onContentChange,
  onElementSelect,
  isMobile,
  isStandalone
}: EditorContentProps) => {
  return (
    <div className={`${isStandalone ? 'w-full' : isMobile ? 'w-full' : 'w-1/2'} bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      {isEditable && (
        <div className="w-full">
          <ToolSettingsMenuBar />
        </div>
      )}
      <div className="p-4 md:p-8">
        <div className="mx-auto">
          <DocumentPreview 
            content={designContent}
            customStyles={customStyles}
            isEditable={isEditable}
            onContentChange={onContentChange}
            onElementSelect={onElementSelect}
          />
        </div>
      </div>
    </div>
  );
};

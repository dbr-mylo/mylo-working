
import React from "react";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { Editor } from "@tiptap/react";
import { FontUnit } from "@/lib/types/preferences";

interface DesignerContentProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
  editor?: Editor | null;
  currentUnit?: FontUnit;
}

export const DesignerContent: React.FC<DesignerContentProps> = ({
  content,
  customStyles,
  isEditable,
  onContentChange,
  onElementSelect,
  editor,
  currentUnit
}) => {
  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto">
        <DocumentPreview 
          content={content}
          customStyles={customStyles}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onElementSelect={onElementSelect}
          renderToolbarOutside={true}
          externalToolbar={isEditable}
          editorInstance={editor}
          currentUnit={currentUnit}
        />
      </div>
    </div>
  );
};

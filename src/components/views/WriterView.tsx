
import React from "react";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Editor } from "@tiptap/react";

interface WriterViewProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
  editorInstance: Editor | null;
}

export const WriterView: React.FC<WriterViewProps> = ({
  content,
  onContentChange,
  isEditorEditable,
  isDesignEditable,
  templateId,
  editorInstance
}) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  return isMobile ? (
    <MobileEditor
      content={content}
      onContentChange={onContentChange}
      isEditorEditable={isEditorEditable}
      isDesignEditable={isDesignEditable}
      templateId={templateId}
      editorInstance={editorInstance}
    />
  ) : (
    <DesktopEditor
      content={content}
      onContentChange={onContentChange}
      isEditorEditable={isEditorEditable}
      isDesignEditable={isDesignEditable}
      templateId={templateId}
      editorInstance={editorInstance}
    />
  );
};

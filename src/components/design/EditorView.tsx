
import { useWindowSize } from "@/hooks/useWindowSize";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { ToolSettingsMenuBar } from "@/components/design/ToolSettingsMenuBar";

interface EditorViewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
  templateId?: string;
  isMobile: boolean;
}

export const EditorView = ({
  content,
  customStyles,
  isEditable,
  onContentChange,
  onElementSelect,
  templateId,
  isMobile
}: EditorViewProps) => {
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto h-full flex flex-col`}>
      {isEditable && (
        <div className="w-full">
          <ToolSettingsMenuBar />
        </div>
      )}
      <div className={`${isMobile ? 'p-0' : 'p-4 pt-6 md:p-8 md:pt-6'} flex-grow`}>
        <div className="mx-auto mt-0">
          <DocumentPreview 
            content={content}
            customStyles={customStyles}
            isEditable={isEditable}
            onContentChange={onContentChange}
            onElementSelect={onElementSelect}
            templateId={templateId}
          />
        </div>
      </div>
    </div>
  );
};


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
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-gray-100 h-full overflow-auto`}>
      {isEditable && (
        <div className="w-full">
          <ToolSettingsMenuBar />
        </div>
      )}
      <div className="p-4 md:p-8">
        <div className="mx-auto">
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

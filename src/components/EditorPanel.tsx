
import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTemplateStyles } from "@/components/design/useTemplateStyles";

export const EditorPanel = ({ content, onContentChange, isEditable, templateId }: EditorPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  // Get template styles
  const { customStyles } = useTemplateStyles(templateId);
  
  const handleContentUpdate = (newContent: string) => {
    console.log("Content updated in EditorPanel");
    onContentChange(newContent);
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 border-r border-editor-border bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-editor-text">Editor Panel</h2>
            {isEditable ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Editable
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                View Only
              </span>
            )}
          </div>
        )}
        <div className="bg-editor-bg rounded-md">
          <RichTextEditor 
            content={content} 
            onUpdate={handleContentUpdate}
            isEditable={isEditable}
            hideToolbar={!isEditable} // Hide toolbar if not editable
            templateStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};


import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";

export const EditorPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 border-r border-editor-border bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && <h2 className="text-sm font-medium text-editor-text mb-4">Editor Panel</h2>}
        <div className="bg-editor-bg p-4 rounded-md">
          <RichTextEditor 
            content={content} 
            onUpdate={onContentChange}
            isEditable={isEditable}
          />
        </div>
      </div>
    </div>
  );
};

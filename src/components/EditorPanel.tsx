
import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";

export const EditorPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  const handleContentUpdate = (newContent: string) => {
    console.log("Content updated in EditorPanel:", newContent);
    onContentChange(newContent);
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 border-r border-editor-border bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <RichTextEditor 
        content={content} 
        onUpdate={handleContentUpdate}
        isEditable={isEditable}
        hideToolbar={!isEditable} 
      />
    </div>
  );
};

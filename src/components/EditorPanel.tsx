
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
    <div className="flex-1 h-full bg-white border-r border-gray-200 overflow-auto">
      <div className="max-w-5xl mx-auto p-4">
        <RichTextEditor 
          content={content} 
          onUpdate={handleContentUpdate}
          isEditable={isEditable}
          hideToolbar={!isEditable} 
        />
      </div>
    </div>
  );
};

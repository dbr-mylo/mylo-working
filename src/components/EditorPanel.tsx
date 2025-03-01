
import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";

export const EditorPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  return (
    <div className="w-1/2 p-8 border-r border-editor-border bg-editor-bg animate-slide-in overflow-auto">
      <div className="mx-auto">
        <h2 className="text-sm font-medium text-editor-text mb-4">Editor Panel</h2>
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

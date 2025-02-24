
import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";

export const DesignPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  return (
    <div className="w-1/2 p-8 border-r border-editor-border bg-editor-bg animate-slide-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm font-medium text-editor-text mb-4">Editor Panel</h2>
        <div className="min-h-[calc(100vh-12rem)] p-4 bg-white border border-editor-border rounded-md shadow-sm">
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


import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { EditorPanelProps } from "@/lib/types";

export const EditorPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="w-1/2 p-8 border-r border-editor-border bg-editor-bg animate-slide-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm font-medium text-editor-text mb-4">Editor Panel</h2>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          disabled={!isEditable}
          placeholder="Start writing your content here..."
          className="w-full min-h-[calc(100vh-12rem)] p-4 text-editor-text resize-none border-editor-border bg-white"
        />
      </div>
    </div>
  );
};

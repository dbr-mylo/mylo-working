
import type { DesignPanelProps } from "@/lib/types";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  return (
    <div className="w-1/2 p-8 bg-editor-panel animate-slide-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm font-medium text-editor-text mb-4">Design Panel</h2>
        <div className="min-h-[calc(100vh-12rem)] p-4 bg-white border border-editor-border rounded-md shadow-sm">
          {content || (
            <p className="text-editor-text opacity-50">
              Content from the editor will appear here with brand styling
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

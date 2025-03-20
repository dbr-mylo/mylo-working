
import React from "react";
import { DocumentStyles } from "./DocumentStyles";

interface EditorViewContentProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onClick: (e: React.MouseEvent) => void;
  stylesContent: string;
  isLoadingTemplate: boolean;
  width: string;
  height: string;
}

/**
 * Component for rendering content in editor view
 * Applies template styling with editor-specific constraints
 */
export const EditorViewContent = ({
  content,
  previewRef,
  onClick,
  stylesContent,
  isLoadingTemplate,
  width,
  height
}: EditorViewContentProps) => {
  if (isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center h-[11in] w-full">
        <div className="animate-pulse text-gray-500">Loading template...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-[${height}] w-[${width}] mx-auto mt-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}>
      {/* Apply template styles with high specificity to override editor choices */}
      {stylesContent && (
        <DocumentStyles customStyles={`
          /* Template styles with higher specificity for editor view */
          .template-styled * {
            font-family: inherit !important;
            color: inherit !important;
            text-align: inherit !important;
          }
          
          /* Add template styles */
          ${stylesContent}
          
          /* Force template typography settings */
          .template-styled [style*="font-family"],
          .template-styled [style*="color"],
          .template-styled [style*="text-align"] {
            font-family: inherit !important;
            color: inherit !important;
            text-align: inherit !important;
          }
        `} />
      )}
      <div 
        ref={previewRef} 
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content }} 
        className="cursor-pointer template-styled p-[1in]" 
      />
    </div>
  );
};

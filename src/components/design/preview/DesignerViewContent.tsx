
import React from "react";
import { DocumentStyles } from "./DocumentStyles";

interface DesignerViewContentProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onClick: (e: React.MouseEvent) => void;
  stylesContent: string;
  isLoadingTemplate: boolean;
  width: string;
  height: string;
  isDesigner: boolean;
}

/**
 * Component for rendering content in designer/admin view
 * Applies special styling for the designer preview
 */
export const DesignerViewContent = ({
  content,
  previewRef,
  onClick,
  stylesContent,
  isLoadingTemplate,
  width,
  height,
  isDesigner
}: DesignerViewContentProps) => {
  // Apply additional styling for design role preview
  const designerPreviewStyles = `
    /* Additional styles for designer preview */
    .designer-preview h1 {
      color: #1a365d;
    }
    
    .designer-preview h2 {
      color: #2a4365;
    }
  `;

  if (isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center h-[11in] w-full">
        <div className="animate-pulse text-gray-500">Loading template...</div>
      </div>
    );
  }

  return (
    <>
      <DocumentStyles customStyles={`
        ${stylesContent}
        ${isDesigner ? designerPreviewStyles : ''}
      `} />
      <div 
        ref={previewRef} 
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content }} 
        className={`cursor-pointer min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 designer-preview template-styled bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}
      />
    </>
  );
};


import React from "react";

interface DocumentPreviewPaneProps {
  content: string;
}

export const DocumentPreviewPane = ({ content }: DocumentPreviewPaneProps) => {
  return (
    <div className="w-1/2 bg-white overflow-auto">
      <div className="p-4 md:p-8">
        <div className="mb-3">
          <h3 className="text-base font-medium text-editor-heading mb-2">Document Preview</h3>
          <div 
            dangerouslySetInnerHTML={{ __html: content }} 
            className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-gray-50 border border-gray-200 rounded-md prose prose-sm max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

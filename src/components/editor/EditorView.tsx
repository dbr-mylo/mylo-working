
/**
 * EditorView Component
 *
 * This component is specifically for the editor role.
 * It shows a live preview of the document with a fixed toolbar.
 */

import React from 'react';
import { RichTextEditor } from "@/components/RichTextEditor";
import { useTemplateStyles } from "@/hooks/useTemplateStyles";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { useIsEditor } from "@/utils/roles";
import { Editor } from "@tiptap/react";
import { DocumentPreview } from "@/components/design/DocumentPreview";

interface EditorViewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
  templateId?: string;
  isMobile: boolean;
}

export const EditorView = ({
  content,
  customStyles,
  isEditable,
  onContentChange,
  onElementSelect,
  templateId,
  isMobile
}: EditorViewProps) => {
  const isEditor = useIsEditor();
  
  // Extract dimensions from template styles, or use default 8.5x11 inches
  const dimensions = extractDimensionsFromCSS(customStyles);
  const pageWidth = dimensions?.width || '8.5in';
  const pageHeight = dimensions?.height || '11in';
  
  const handleContentUpdate = (newContent: string) => {
    console.log("Content updated in EditorView");
    onContentChange(newContent);
  };

  if (!isEditor) {
    console.warn("EditorView component used outside of editor role context");
  }
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-editor-panel h-full overflow-auto`}>
      <div className="p-4 pt-6 md:p-8 md:pt-6 h-full">
        <div className="mx-auto mt-0">
          <div className="bg-editor-panel rounded-md">
            <div className="mx-auto" style={{ width: pageWidth }}>
              <RichTextEditor 
                content={content} 
                onUpdate={handleContentUpdate}
                isEditable={isEditable}
                hideToolbar={true} // Hide the toolbar since we're using external toolbar
                externalToolbar={true}
                templateStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

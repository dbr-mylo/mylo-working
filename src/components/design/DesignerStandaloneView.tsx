
/**
 * DesignerStandaloneView Component
 * 
 * WARNING: CORE DESIGNER COMPONENT
 * This component is specifically for the designer role and should not be modified
 * unless absolutely necessary. Changes here directly impact the designer experience.
 */

import { useState } from "react";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { EditorToolbar } from "@/components/rich-text/EditorToolbar";
import { Editor } from "@tiptap/react";
import { DesignerSidebar } from "@/components/design/DesignerSidebar";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";

interface DesignerStandaloneViewProps {
  content: string;
  designContent: string;
  customStyles: string;
  isEditable: boolean;
  editorSetup: {
    editor: Editor;
    currentFont: string;
    currentColor: string;
    handleFontChange: (font: string) => void;
    handleColorChange: (color: string) => void;
  } | null;
  onContentChange: (content: string) => void;
  onElementSelect: (element: HTMLElement | null) => void;
}

export const DesignerStandaloneView = ({
  content,
  designContent,
  customStyles,
  isEditable,
  editorSetup,
  onContentChange,
  onElementSelect
}: DesignerStandaloneViewProps) => {
  // Extract dimensions from template styles
  const dimensions = extractDimensionsFromCSS(customStyles);
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  return (
    <div className="w-full flex flex-col">
      {isEditable && (
        <div className="w-full">
          <div className="bg-white border-b border-slate-200 z-10">
            <div className="flex items-center justify-between px-4">
              {editorSetup?.editor && (
                <div className="flex-1 py-2">
                  <EditorToolbar 
                    editor={editorSetup.editor}
                    currentFont={editorSetup.currentFont}
                    currentColor={editorSetup.currentColor}
                    onFontChange={editorSetup.handleFontChange}
                    onColorChange={editorSetup.handleColorChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row flex-1">
        <div className="w-full bg-editor-panel overflow-auto">
          <div className="p-4 md:p-8">
            <div className="mx-auto">
              <DocumentPreview 
                content={designContent}
                customStyles={customStyles}
                isEditable={isEditable}
                onContentChange={onContentChange}
                onElementSelect={onElementSelect}
                renderToolbarOutside={true}
                externalToolbar={isEditable}
                editorInstance={editorSetup?.editor}
              />
            </div>
          </div>
        </div>
        
        <DesignerSidebar editorInstance={editorSetup?.editor} />
      </div>
    </div>
  );
};

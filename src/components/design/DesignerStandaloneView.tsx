/**
 * DesignerStandaloneView Component
 * 
 * WARNING: CORE DESIGNER COMPONENT
 * This component is specifically for the designer role and should not be modified
 * unless absolutely necessary. Changes here directly impact the designer experience.
 */

import { useState, useEffect } from "react";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { EditorToolbar } from "@/components/rich-text/EditorToolbar";
import { Editor } from "@tiptap/react";
import { DesignerSidebar } from "@/components/design/DesignerSidebar";
import { PreviewToggleButton } from "@/components/design/PreviewToggleButton";
import { getPreviewVisibilityPreference, setPreviewVisibilityPreference } from "@/components/editor-nav/EditorNavUtils";
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
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    return getPreviewVisibilityPreference();
  });
  
  useEffect(() => {
    setPreviewVisibilityPreference(isPreviewVisible);
  }, [isPreviewVisible]);
  
  const handleTogglePreview = () => {
    setIsPreviewVisible(prev => !prev);
  };

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
              <div className="flex items-center h-full">
                <PreviewToggleButton 
                  isPreviewVisible={isPreviewVisible} 
                  onToggle={handleTogglePreview} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row flex-1">
        <div className={isPreviewVisible ? "w-1/2 bg-editor-panel overflow-auto border-r border-editor-border" : "w-full bg-editor-panel overflow-auto"}>
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
        
        {isPreviewVisible && (
          <div className="w-1/2 bg-editor-panel overflow-auto">
            <div className="p-4 md:p-8">
              <div className="mb-3">
                <h3 className="text-base font-medium text-editor-heading mb-2">Document Preview</h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: designContent }} 
                  className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] prose prose-sm max-w-none`}
                />
              </div>
            </div>
          </div>
        )}
        
        <DesignerSidebar editorInstance={editorSetup?.editor} />
      </div>
    </div>
  );
};

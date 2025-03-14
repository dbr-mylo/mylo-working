
/**
 * EditorPanel Component
 * 
 * This component is specifically for the editor role.
 * It should NOT include designer-specific functionality.
 * Use the useIsEditor() hook from roleSpecificRendering.tsx to enforce this separation.
 */

import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTemplateStyles } from "@/components/design/useTemplateStyles";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { useIsEditor } from "@/utils/roleSpecificRendering";

export const EditorPanel = ({
  content,
  onContentChange,
  isEditable,
  templateId
}: EditorPanelProps) => {
  const {
    width
  } = useWindowSize();
  const isMobile = width < 1281;
  const isEditor = useIsEditor(); // Confirm we're in editor role

  // Get template styles
  const {
    customStyles
  } = useTemplateStyles(templateId);

  // Extract dimensions from template styles, or use default 8.5x11 inches
  const dimensions = extractDimensionsFromCSS(customStyles);
  const pageWidth = dimensions?.width || '8.5in';
  const pageHeight = dimensions?.height || '11in';
  
  const handleContentUpdate = (newContent: string) => {
    console.log("Content updated in EditorPanel");
    onContentChange(newContent);
  };

  // This component should only be used in editor mode
  if (!isEditor) {
    console.warn("EditorPanel component used outside of editor role context");
  }
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 border-r border-editor-border bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-medium text-editor-text">Editor Panel</h2>
            {isEditable ? <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Editable
              </span> : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                View Only
              </span>}
          </div>}
        <div className="bg-editor-bg rounded-md">
          {/* Document container with exact dimensions applied */}
          <div className="mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]" style={{ width: pageWidth }}>
            <RichTextEditor 
              content={content} 
              onUpdate={handleContentUpdate}
              isEditable={isEditable}
              hideToolbar={!isEditable} // Hide toolbar if not editable
              templateStyles={customStyles} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};


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
import { Editor } from "@tiptap/react";

export const EditorPanel = ({
  content,
  onContentChange,
  isEditable,
  templateId,
  editorInstance
}: EditorPanelProps & { editorInstance?: Editor | null }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  const isEditor = useIsEditor(); // Confirm we're in editor role

  // Get template styles
  const { customStyles } = useTemplateStyles(templateId);

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
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto h-full flex flex-col`}>
      <div className={`${isMobile ? 'p-0' : 'p-4 pt-6 md:p-8 md:pt-6'} flex-grow`}>
        <div className="mx-auto mt-0">
          {/* Document container with consistent styling */}
          <div className="bg-editor-bg rounded-md">
            {/* Document container with proper dimensions */}
            <div className="mx-auto" style={{ width: pageWidth }}>
              <RichTextEditor 
                content={content} 
                onUpdate={handleContentUpdate}
                isEditable={isEditable}
                hideToolbar={true} // Always hide the toolbar since we're showing it in the container
                templateStyles={customStyles}
                externalEditorInstance={editorInstance}
                externalToolbar={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

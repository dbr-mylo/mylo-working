
/**
 * EditorPanel Component
 * 
 * This component is specifically for the writer role.
 * It should NOT include designer-specific functionality.
 * Use the useIsWriter() hook from roles module to enforce this separation.
 */

import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTemplateStyles } from "@/hooks/useTemplateStyles";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { useIsWriter } from "@/utils/roles";
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
  const isWriter = useIsWriter(); // Confirm we're in writer role

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

  // This component should only be used in writer mode
  if (!isWriter) {
    console.warn("EditorPanel component used outside of writer role context");
  }
  
  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto">
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
  );
};

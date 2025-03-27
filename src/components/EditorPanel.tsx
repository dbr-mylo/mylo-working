
/**
 * EditorPanel Component
 * 
 * This component is specifically for the writer role.
 * It provides the editable document view with proper dimensions.
 */

import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTemplateStyles } from "@/hooks/useTemplateStyles";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { useIsWriter, useIsWriterOrAdmin } from "@/utils/roles";
import { Editor } from "@tiptap/react";
import { EditorToolbarContainer } from "@/components/EditorToolbarContainer";

export const EditorPanel = ({
  content,
  onContentChange,
  isEditable,
  templateId,
  editorInstance
}: EditorPanelProps & { editorInstance?: Editor | null }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  const isWriter = useIsWriterOrAdmin();

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
  
  // Early return if not writer role
  if (!isWriter) {
    console.warn("EditorPanel used outside of writer role context");
    return null;
  }
  
  return (
    <div className="p-4 md:p-8">
      {/* External editor toolbar - shown when editor instance is provided */}
      {editorInstance && isEditable && (
        <div className="mb-4">
          <EditorToolbarContainer editor={editorInstance} isEditable={isEditable} />
        </div>
      )}
      
      <div className="mx-auto">
        {/* Document container with proper dimensions */}
        <div className="mx-auto" style={{ width: pageWidth }}>
          <RichTextEditor 
            content={content} 
            onUpdate={handleContentUpdate}
            isEditable={isEditable}
            hideToolbar={!!editorInstance} // Hide the toolbar if we have an external one
            templateStyles={customStyles}
            externalEditorInstance={editorInstance}
            externalToolbar={!!editorInstance}
          />
        </div>
      </div>
    </div>
  );
};

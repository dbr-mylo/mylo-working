
/**
 * EditableContent Component
 * 
 * WARNING: This component contains role-specific rendering logic.
 * Changes to the designer role functionality (isDesigner === true) should be avoided.
 * Only modify the editor role section unless absolutely necessary.
 * 
 * To make changes to editor functionality only, focus on the non-designer code path.
 */

import { RichTextEditor } from "@/components/RichTextEditor";
import { useAuth } from "@/contexts/AuthContext";
import { Editor } from "@tiptap/react";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";

interface EditableContentProps {
  content: string;
  onContentChange: (content: string) => void;
  hideToolbar?: boolean;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  editorInstance?: Editor | null;
  templateStyles?: string;
}

export const EditableContent = ({ 
  content, 
  onContentChange, 
  hideToolbar = false,
  renderToolbarOutside = false,
  externalToolbar = false,
  editorInstance = null,
  templateStyles = ''
}: EditableContentProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // For editor role, we don't apply template styling to the editable content
  const shouldApplyTemplate = false;
  
  // Extract dimensions from template styles
  const dimensions = extractDimensionsFromCSS(templateStyles);
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  // DESIGNER PATH - DO NOT MODIFY
  if (isDesigner) {
    // For designer role, don't wrap in the white div
    return (
      <RichTextEditor
        content={content}
        onUpdate={onContentChange}
        isEditable={true}
        hideToolbar={false} // Always show toolbar for designers
        renderToolbarOutside={renderToolbarOutside}
        externalToolbar={externalToolbar}
        externalEditorInstance={editorInstance}
        applyTemplateStyling={shouldApplyTemplate}
        templateStyles={templateStyles}
      />
    );
  } 

  // EDITOR PATH - Safe to modify
  // For editor role, render toolbar outside the document container with added spacing
  return (
    <div className="editor-content-container mt-12 mb-10">
      {/* Main document container with increased spacing but no extra border */}
      <div style={{ width: width, margin: '0 auto' }} className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
        <div className="font-editor">
          <RichTextEditor
            content={content}
            onUpdate={onContentChange}
            isEditable={true}
            hideToolbar={hideToolbar}
            applyTemplateStyling={shouldApplyTemplate}
            templateStyles={templateStyles}
          />
        </div>
      </div>
    </div>
  );
};

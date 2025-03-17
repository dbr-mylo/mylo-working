
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
import { useIsDesigner } from "@/utils/roles";
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
  const isDesigner = useIsDesigner();
  
  // Important: For editor role, we explicitly set this to false to prevent template styling
  // from affecting the editable content, allowing editors to format text freely
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
        hideToolbar={hideToolbar} // Set based on passed prop
        renderToolbarOutside={renderToolbarOutside}
        externalToolbar={externalToolbar}
        externalEditorInstance={editorInstance}
        applyTemplateStyling={shouldApplyTemplate}
        templateStyles={templateStyles}
      />
    );
  } 

  // EDITOR PATH - Safe to modify
  // For editor role, render toolbar above the document container
  return (
    <div className="editor-content-container mt-0 mb-6">
      {/* Main document container */}
      <div style={{ width, margin: '0 auto' }} className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
        <div className="font-editor">
          <RichTextEditor
            content={content}
            onUpdate={onContentChange}
            isEditable={true}
            hideToolbar={hideToolbar}
            externalToolbar={externalToolbar}
            externalEditorInstance={editorInstance}
            applyTemplateStyling={shouldApplyTemplate}
            templateStyles={templateStyles}
          />
        </div>
      </div>
    </div>
  );
};

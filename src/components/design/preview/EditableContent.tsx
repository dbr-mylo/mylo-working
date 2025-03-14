
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

  // For editor role, create the white div with shadow and dimensions
  return (
    <div className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}>
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
  );
};

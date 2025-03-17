
/**
 * DesktopEditor Component
 * 
 * This component provides a split view for the editor role,
 * showing both the editable document and preview.
 */

import React from 'react';
import { EditorPanel } from '@/components/EditorPanel';
import { DocumentPreview } from '@/components/design/DocumentPreview';
import { useIsEditor } from '@/utils/roles';
import { Editor } from '@tiptap/react';
import { useTemplateStyles } from '@/hooks/useTemplateStyles';

interface DesktopEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
  editorInstance?: Editor | null;
}

export const DesktopEditor: React.FC<DesktopEditorProps> = ({
  content,
  onContentChange,
  isEditorEditable,
  isDesignEditable,
  templateId,
  editorInstance
}) => {
  const isEditor = useIsEditor();
  
  // Get template styles
  const { customStyles } = useTemplateStyles(templateId);
  
  if (!isEditor) {
    console.warn("DesktopEditor used outside of editor role");
    return null;
  }
  
  return (
    <div className="flex h-[calc(100vh-56px-48px)]">
      {/* Editor panel - left side */}
      <div className="w-1/2 bg-white overflow-auto h-full">
        <EditorPanel
          content={content}
          onContentChange={onContentChange}
          isEditable={isEditorEditable}
          templateId={templateId}
          editorInstance={editorInstance}
        />
      </div>
      
      {/* Preview panel - right side */}
      <div className="w-1/2 bg-[#f3f4f6] overflow-auto h-full">
        <div className="p-4 md:p-8">
          <DocumentPreview 
            content={content}
            customStyles={customStyles}
            isEditable={false}
            onContentChange={onContentChange}
            templateId={templateId}
          />
        </div>
      </div>
    </div>
  );
};

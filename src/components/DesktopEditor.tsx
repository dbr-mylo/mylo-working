
/**
 * DesktopEditor Component
 * 
 * This component provides a split view for the editor role,
 * showing both the editable document and preview.
 */

import React from 'react';
import { EditorPanel } from '@/components/EditorPanel';
import { EditableContent } from '@/components/design/preview/EditableContent';
import { useIsEditor } from '@/utils/roles';
import { Editor } from '@tiptap/react';

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
  
  if (!isEditor) {
    console.warn("DesktopEditor used outside of editor role");
    return null;
  }
  
  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Editor panel - left side */}
      <EditorPanel
        content={content}
        onContentChange={onContentChange}
        isEditable={isEditorEditable}
        templateId={templateId}
        editorInstance={editorInstance}
      />
      
      {/* Preview panel - right side */}
      <div className="w-1/2 bg-design-panel overflow-auto">
        <div className="p-4 md:p-8 flex-grow flex flex-col h-full">
          <div className="mx-auto mt-0 flex-grow">
            <EditableContent
              content={content}
              onContentChange={onContentChange}
              hideToolbar={true}
              externalToolbar={true}
              editorInstance={editorInstance}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

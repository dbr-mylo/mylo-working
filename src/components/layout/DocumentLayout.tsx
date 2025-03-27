
import React from "react";
import { EditorNav } from "@/components/editor-nav";
import { EditorToolbarContainer } from "@/components/EditorToolbarContainer";
import { Editor } from "@tiptap/react";
import { UserRole } from "@/lib/types";
import { Document } from "@/lib/types";

interface DocumentLayoutProps {
  role: UserRole | null;
  content: string;
  documentTitle: string;
  onTitleChange: (title: string) => Promise<void>;
  onSave: () => Promise<void>;
  onLoadDocument?: (doc: Document) => void;
  initialContent: string;
  templateId?: string;
  onTemplateChange?: (templateId: string) => void;
  editorInstance: Editor | null;
  isEditorEditable: boolean;
  isWriter: boolean;
  children: React.ReactNode;
}

export const DocumentLayout: React.FC<DocumentLayoutProps> = ({
  role,
  content,
  documentTitle,
  onTitleChange,
  onSave,
  onLoadDocument,
  initialContent,
  templateId,
  onTemplateChange,
  editorInstance,
  isEditorEditable,
  isWriter,
  children
}) => {
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "writer"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={onTitleChange}
        onSave={onSave}
        onLoadDocument={onLoadDocument}
        initialContent={initialContent}
        templateId={templateId}
        onTemplateChange={onTemplateChange}
      />
      
      {/* Add the toolbar container below the nav when in writer mode */}
      {isWriter && (
        <EditorToolbarContainer 
          editor={editorInstance} 
          isEditable={isEditorEditable}
        />
      )}
      
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
};

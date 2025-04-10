
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EditorNav } from "@/components/editor-nav";
import { Document, UserRole } from "@/lib/types";

interface RoleAwareLayoutProps {
  role: UserRole | null;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onSave?: () => Promise<void>;
  onLoadDocument?: (doc: Document) => void;
  children: React.ReactNode;
  initialContent?: string;
  templateId?: string;
  showRoleNavigation?: boolean;  // Add the missing prop
}

export const RoleAwareLayout: React.FC<RoleAwareLayoutProps> = ({
  role,
  content,
  documentTitle = "",
  onTitleChange,
  onSave,
  onLoadDocument,
  children,
  initialContent = "",
  templateId,
  showRoleNavigation = true  // Add default value
}) => {
  const { user } = useAuth();
  const currentRole = role || "editor";
  
  return (
    <div className="flex flex-col h-full">
      <EditorNav
        currentRole={currentRole}
        content={content}
        documentTitle={documentTitle}
        onTitleChange={onTitleChange}
        onSave={onSave}
        onLoadDocument={onLoadDocument}
        initialContent={initialContent}
        templateId={templateId}
        showRoleNavigation={showRoleNavigation}  // Pass to EditorNav if needed
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

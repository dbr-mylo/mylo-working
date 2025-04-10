
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
  showRoleNavigation?: boolean;
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
  showRoleNavigation = true
}) => {
  const { user } = useAuth();
  const currentRole = role || "editor";
  
  // Check if we're rendering children directly (like for Dashboard)
  // Instead of checking displayName, check if the element's type is called "Dashboard"
  const renderDirectly = React.isValidElement(children) && 
    ((typeof children.type === 'function' && 
      children.type.toString().includes('Dashboard')) ||
     children.type === 'Dashboard');
  
  if (renderDirectly) {
    return <>{children}</>;
  }
  
  // Otherwise, render with the EditorNav
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
        showRoleNavigation={showRoleNavigation}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

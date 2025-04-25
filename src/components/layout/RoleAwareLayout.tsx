import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EditorNav } from "@/components/editor-nav";
import { Document, UserRole } from "@/lib/types";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const currentRole = role || "editor";
  
  // Check if current route is auth route - don't show editor nav
  const isAuthRoute = location.pathname === "/auth";
  
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  // Check if we're rendering children directly (e.g. for Dashboard)
  const renderDirectly = React.isValidElement(children) && 
    ((typeof children.type === 'function' && 
      (children.type.name === 'Dashboard' || 
       children.type.displayName === 'Dashboard' || 
       /Dashboard/.test(String(children.type)))) ||
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

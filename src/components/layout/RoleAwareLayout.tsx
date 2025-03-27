
import React from "react";
import { EditorNav } from "@/components/editor-nav";
import { RoleNavigation } from "@/components/navigation/RoleNavigation";
import { UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface RoleAwareLayoutProps {
  children: React.ReactNode;
  role: UserRole | null;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onSave?: () => Promise<void>;
  onLoadDocument?: (documentId: string) => Promise<void>;
  initialContent?: string;
  templateId?: string;
  onTemplateChange?: (templateId: string | undefined) => void;
  editorInstance?: any;
  showRoleNavigation?: boolean;
}

export const RoleAwareLayout: React.FC<RoleAwareLayoutProps> = ({
  children,
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
  showRoleNavigation = true
}) => {
  const { toast } = useToast();
  
  const handleRoleAction = (actionType: string) => {
    if (role === "writer" && actionType === "design") {
      toast({
        title: "Access Limited",
        description: "Design features are only available for Designer role",
        variant: "destructive",
      });
      return false;
    }
    if (role === "designer" && actionType === "edit") {
      toast({
        title: "Access Limited",
        description: "Content editing is only available for Writer role",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  return (
    <div className="min-h-screen bg-editor-bg flex flex-col">
      {/* Main Navigation */}
      <EditorNav
        currentRole={role || "writer"}
        documentTitle={documentTitle || ""}
        onTitleChange={onTitleChange}
        onSave={onSave}
        content={content}
        initialContent={initialContent}
        onLoadDocument={onLoadDocument}
      />
      
      {/* Role-based Navigation */}
      {showRoleNavigation && (
        <div className="border-b border-editor-border">
          <RoleNavigation />
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

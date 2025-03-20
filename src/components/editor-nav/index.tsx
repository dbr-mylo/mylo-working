
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import type { EditorNavProps } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserDocuments } from "./EditorNavUtils";
import { 
  DocumentTitle, 
  DocumentControls, 
  ExternalActions,
  CloseDocumentDialog 
} from "./components";
import { useDocumentTitle, useCloseDocument, useDocumentSave } from "./hooks";

export const EditorNav = ({ 
  currentRole, 
  onSave, 
  content, 
  documentTitle = "", 
  onTitleChange,
  onLoadDocument,
  initialContent = "" 
}: EditorNavProps) => {
  const { signOut, user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] = useState(
    currentRole === "designer" ? "Create Template Title" : "Create Document Title"
  );
  
  // Use the same nav height for both roles to ensure consistent padding
  const navHeight = "h-14";
  const documentType = currentRole === "designer" ? "template" : "document";

  const { title, handleTitleChange, handleTitleBlur } = useDocumentTitle({
    initialTitle: documentTitle,
    onTitleChange
  });
  
  const { showCloseDialog, setShowCloseDialog, handleCloseDocument, 
          handleCloseWithoutSaving, handleSaveAndClose } = useCloseDocument({
    content,
    initialContent,
    title,
    documentTitle,
    onSave
  });
  
  const { isSaving, handleSave } = useDocumentSave({
    onSave,
    loadDocuments,
    content,
    documentType
  });

  useEffect(() => {
    loadDocuments();
  }, [user]);

  useEffect(() => {
    setTitlePlaceholder(currentRole === "designer" ? "Create Template Title" : "Create Document Title");
  }, [currentRole]);

  async function loadDocuments(): Promise<void> {
    setIsLoadingDocs(true);
    try {
      const docs = await fetchUserDocuments(user?.id, currentRole);
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
    return Promise.resolve();
  }

  return (
    <nav className={`${navHeight} border-b border-editor-border bg-white px-4 flex items-center justify-between`}>
      <div className="flex items-center space-x-4">
        <FileText className="w-5 h-5 text-editor-text" />
        <DocumentTitle 
          title={title}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
          isEditable={currentRole === "editor" || currentRole === "designer"}
          placeholder={titlePlaceholder}
        />
        {user && (
          <span className="text-sm text-editor-text opacity-50">
            ({currentRole})
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <DocumentControls
          onSave={handleSave}
          isSaving={isSaving}
          onLoadDocument={onLoadDocument}
          documents={documents}
          isLoadingDocs={isLoadingDocs}
          documentType={documentType}
          currentRole={currentRole}
        />
        
        <ExternalActions 
          onSignOut={signOut} 
          isAuthenticated={!!user}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCloseDocument}
          title={`Close ${documentType}`}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <CloseDocumentDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        onClose={handleCloseWithoutSaving}
        onSaveAndClose={handleSaveAndClose}
        isDesigner={currentRole === "designer"}
      />
    </nav>
  );
};

export * from './components';
export * from './hooks';

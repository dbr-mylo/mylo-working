
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import type { EditorNavProps } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DocumentTitle } from "./DocumentTitle";
import { DocumentControls } from "./DocumentControls";
import { ExternalActions } from "./ExternalActions";
import { CloseDocumentDialog } from "./CloseDocumentDialog";
import { fetchUserDocuments, hasUnsavedChanges } from "./EditorNavUtils";
import type { Document } from "@/lib/types";

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
  const { toast } = useToast();
  const [title, setTitle] = useState(documentTitle);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] = useState("Create Document Title");
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async (): Promise<void> => {
    setIsLoadingDocs(true);
    try {
      const docs = await fetchUserDocuments(user?.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error loading documents",
        description: "There was a problem loading your documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocs(false);
    }
    return Promise.resolve();
  };

  const handleCloseDocument = () => {
    if (hasUnsavedChanges(content, initialContent, title, documentTitle)) {
      setShowCloseDialog(true);
    } else {
      navigateToDocumentList();
    }
  };

  const navigateToDocumentList = () => {
    navigate('/');
  };

  const handleCloseWithoutSaving = () => {
    setShowCloseDialog(false);
    navigateToDocumentList();
  };

  const handleSaveAndClose = async () => {
    setShowCloseDialog(false);
    await handleSave();
    navigateToDocumentList();
  };
  
  const handleSave = async (): Promise<void> => {
    if (onSave) {
      await onSave();
      await loadDocuments();
    }
    return Promise.resolve();
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  return (
    <nav className="h-16 border-b border-editor-border bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileText className="w-6 h-6 text-editor-text" />
        <DocumentTitle 
          title={title}
          onTitleChange={handleTitleChange}
          isEditable={currentRole === "editor"}
          placeholder={titlePlaceholder}
        />
        {user && (
          <span className="text-sm text-editor-text opacity-50">
            ({currentRole})
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {currentRole === "editor" && (
          <DocumentControls
            onSave={onSave}
            onLoadDocument={onLoadDocument}
            documents={documents}
            isLoadingDocs={isLoadingDocs}
            content={content}
          />
        )}
        
        <ExternalActions 
          onSignOut={signOut} 
          isAuthenticated={!!user}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCloseDocument}
          title="Close document"
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
      />
    </nav>
  );
};

export * from './DocumentControls';
export * from './DocumentTitle';
export * from './ExternalActions';
export * from './CloseDocumentDialog';

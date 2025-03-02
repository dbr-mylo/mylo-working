
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { EditorNavProps, SaveDocumentResult } from "@/lib/types";
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
  initialContent = "",
  onReturnToLogin
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
      console.log(`Fetching documents for role: ${currentRole}`);
      const docs = await fetchUserDocuments(user?.id, currentRole);
      console.log(`Fetched ${docs.length} documents`);
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

  const handleCloseDocument = (): Promise<void> => {
    console.log("Close document triggered. Content length:", content?.length);
    console.log("Initial content length:", initialContent?.length);
    
    if (hasUnsavedChanges(content, initialContent, title, documentTitle)) {
      console.log("Unsaved changes detected, showing dialog");
      setShowCloseDialog(true);
    } else {
      console.log("No unsaved changes, navigating to document list");
      navigateToDocumentList();
    }
    return Promise.resolve();
  };

  const navigateToDocumentList = (): Promise<void> => {
    navigate('/');
    return Promise.resolve();
  };

  const handleCloseWithoutSaving = async (): Promise<void> => {
    console.log("Closing without saving");
    setShowCloseDialog(false);
    await navigateToDocumentList();
    return Promise.resolve();
  };

  const handleSaveAndClose = async (): Promise<void> => {
    console.log("Saving and closing");
    setShowCloseDialog(false);
    
    if (onSave) {
      console.log("Calling onSave");
      const saveResult = await onSave();
      console.log("Save completed", saveResult);
    }
    
    console.log("Navigating away");
    await navigateToDocumentList();
    return Promise.resolve();
  };
  
  const handleSave = async (): Promise<void> => {
    console.log("Save triggered from nav");
    if (onSave) {
      const saveResult = await onSave();
      console.log("Save result:", saveResult);
      if (saveResult.success) {
        await loadDocuments();
      }
    }
    return Promise.resolve();
  };

  const handleTitleChange = async (newTitle: string): Promise<void> => {
    setTitle(newTitle);
    if (onTitleChange) {
      await onTitleChange(newTitle);
    }
    return Promise.resolve();
  };

  const handleOpenDocument = () => {
    // This will open the document dropdown
    const openDropdownButton = document.querySelector('[data-document-controls-open-button]');
    if (openDropdownButton instanceof HTMLElement) {
      openDropdownButton.click();
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
            onSave={onSave ? handleSave : undefined}
            onLoadDocument={onLoadDocument}
            documents={documents}
            isLoadingDocs={isLoadingDocs}
            content={content}
            setOpenButtonRef={btn => btn?.setAttribute('data-document-controls-open-button', '')}
          />
        )}
        
        <ExternalActions 
          onSignOut={signOut} 
          isAuthenticated={!!user}
          onReturnToLogin={onReturnToLogin}
          onSave={onSave ? handleSave : undefined}
          onClose={handleCloseDocument}
          onOpen={currentRole === "editor" ? handleOpenDocument : undefined}
        />
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

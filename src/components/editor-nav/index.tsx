
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
  const [titlePlaceholder, setTitlePlaceholder] = useState(
    currentRole === "designer" ? "Create Template Title" : "Create Document Title"
  );
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const navigate = useNavigate();
  const isDesigner = currentRole === "designer";
  
  // Use a smaller nav height for designers
  const navHeight = isDesigner ? "h-8" : "h-16";

  useEffect(() => {
    setTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  useEffect(() => {
    // Update placeholder based on role
    setTitlePlaceholder(currentRole === "designer" ? "Create Template Title" : "Create Document Title");
  }, [currentRole]);

  const loadDocuments = async (): Promise<void> => {
    setIsLoadingDocs(true);
    try {
      const docs = await fetchUserDocuments(user?.id, currentRole);
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: `Error loading ${currentRole === "designer" ? "templates" : "documents"}`,
        description: `There was a problem loading your ${currentRole === "designer" ? "templates" : "documents"}.`,
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
      await onSave();
      console.log("Save completed");
    }
    
    console.log("Navigating away");
    await navigateToDocumentList();
    return Promise.resolve();
  };
  
  const handleSave = async (): Promise<void> => {
    console.log("Save triggered from nav");
    if (onSave) {
      await onSave();
      await loadDocuments();
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

  return (
    <nav className={`${navHeight} border-b border-editor-border bg-white px-4 flex items-center justify-between`}>
      <div className="flex items-center space-x-4">
        <FileText className="w-6 h-6 text-editor-text" />
        <DocumentTitle 
          title={title}
          onTitleChange={handleTitleChange}
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
          onSave={onSave}
          onLoadDocument={onLoadDocument}
          documents={documents}
          isLoadingDocs={isLoadingDocs}
          content={content}
        />
        
        <ExternalActions 
          onSignOut={signOut} 
          isAuthenticated={!!user}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCloseDocument}
          title={`Close ${currentRole === "designer" ? "template" : "document"}`}
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

export * from './DocumentControls';
export * from './DocumentTitle';
export * from './ExternalActions';
export * from './CloseDocumentDialog';

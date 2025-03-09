
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/document/DocumentList";
import { DeleteDocumentDialog } from "@/components/document/DeleteDocumentDialog";
import {
  fetchUserDocumentsFromSupabase,
  fetchGuestDocumentsFromLocalStorage,
  deleteDocumentFromSupabase,
  deleteDocumentFromLocalStorage,
  deduplicateDocuments
} from "@/utils/documentUtils";

const DocumentSelection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log("DocumentSelection rendered, role:", role, "user:", user ? "logged in" : "not logged in");
  
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";
  const itemTypePlural = isDesigner ? "templates" : "documents";

  useEffect(() => {
    console.log("Fetching user documents...");
    fetchUserDocuments();
  }, [user, role]);

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        console.log("Fetching documents for logged in user:", user.id);
        const data = await fetchUserDocumentsFromSupabase(user.id);
        const uniqueDocuments = deduplicateDocuments(data);
        setDocuments(uniqueDocuments);
        console.log("Fetched documents:", uniqueDocuments.length);
      } else if (role) {
        console.log("Fetching documents for guest with role:", role);
        try {
          const uniqueDocs = fetchGuestDocumentsFromLocalStorage(role);
          setDocuments(uniqueDocs);
          console.log("Fetched local documents:", uniqueDocs.length);
          
          // Also update the localStorage with deduplicated list if needed
          const storageKey = role === 'designer' ? 'designerDocuments' : 'editorDocuments';
          const localDocs = localStorage.getItem(storageKey);
          if (localDocs && JSON.parse(localDocs).length !== uniqueDocs.length) {
            localStorage.setItem(storageKey, JSON.stringify(uniqueDocs));
            toast({
              title: `Duplicate ${itemTypePlural} removed`,
              description: `We've cleaned up some duplicate ${itemTypePlural} for you.`,
            });
          }
        } catch (error) {
          console.error(`Error loading ${role} ${itemTypePlural}:`, error);
          setDocuments([]);
        }
      } else {
        console.log("No user or role found, showing empty document list");
        setDocuments([]);
      }
    } catch (error) {
      console.error(`Error fetching ${itemTypePlural}:`, error);
      toast({
        title: `Error loading ${itemTypePlural}`,
        description: `There was a problem loading your ${itemTypePlural}.`,
        variant: "destructive",
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewDocument = () => {
    navigate("/editor");
  };

  const handleOpenDocument = (docId: string) => {
    navigate(`/editor/${docId}`);
  };

  const confirmDelete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setDocumentToDelete(docId);
  };

  const cancelDelete = () => {
    setDocumentToDelete(null);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      if (user) {
        await deleteDocumentFromSupabase(documentToDelete, user.id);
      } else if (role) {
        const updatedDocs = deleteDocumentFromLocalStorage(documentToDelete, role);
        setDocuments(updatedDocs);
      }
      
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: `${isDesigner ? "Template" : "Document"} deleted`,
        description: `Your ${itemType} has been successfully deleted.`,
      });
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      toast({
        title: `Error deleting ${itemType}`,
        description: `There was a problem deleting your ${itemType}.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-editor-bg p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-editor-heading mb-2">
            Your {isDesigner ? "Design Templates" : "Documents"}
          </h1>
          <p className="text-editor-text">
            Select a {itemType} to edit or create a new one
          </p>
        </header>
        
        <div className="mb-6">
          <Button 
            onClick={handleCreateNewDocument}
            className="text-base"
          >
            Create New {isDesigner ? "Template" : "Document"}
          </Button>
        </div>

        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onDeleteDocument={confirmDelete}
            onSelectDocument={handleOpenDocument}
            isDesigner={isDesigner}
          />
        </div>
      </div>

      <DeleteDocumentDialog
        isOpen={documentToDelete !== null}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={handleDeleteDocument}
        isDesigner={isDesigner}
      />
    </div>
  );
};

export default DocumentSelection;

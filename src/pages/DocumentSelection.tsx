
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

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const data = await fetchUserDocumentsFromSupabase(user.id);
        const uniqueDocuments = deduplicateDocuments(data);
        setDocuments(uniqueDocuments);
      } else if (role) {
        try {
          const uniqueDocs = fetchGuestDocumentsFromLocalStorage();
          setDocuments(uniqueDocs);
          
          // Also update the localStorage with deduplicated list if needed
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs && JSON.parse(localDocs).length !== uniqueDocs.length) {
            localStorage.setItem('guestDocuments', JSON.stringify(uniqueDocs));
            toast({
              title: "Duplicate documents removed",
              description: "We've cleaned up some duplicate documents for you.",
            });
          }
        } catch (error) {
          console.error("Error loading local documents:", error);
          setDocuments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error loading documents",
        description: "There was a problem loading your documents.",
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
        const updatedDocs = deleteDocumentFromLocalStorage(documentToDelete);
        setDocuments(updatedDocs);
      }
      
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: "Document deleted",
        description: "Your document has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error deleting document",
        description: "There was a problem deleting your document.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-editor-bg p-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-editor-heading mb-2">Your Documents</h1>
          <p className="text-editor-text">Select a document to edit or create a new one</p>
        </header>
        
        <div className="mb-6">
          <Button 
            onClick={handleCreateNewDocument}
            className="text-base"
          >
            Create New
          </Button>
        </div>

        <div className="w-1/2 mx-auto">
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onDeleteDocument={confirmDelete}
            onSelectDocument={handleOpenDocument}
          />
        </div>
      </div>

      <DeleteDocumentDialog
        isOpen={documentToDelete !== null}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
};

export default DocumentSelection;

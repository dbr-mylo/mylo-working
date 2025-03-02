
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/document/DocumentList";
import { DeleteDocumentDialog } from "@/components/document/DeleteDocumentDialog";
import { useWindowSize } from "@/hooks/useWindowSize";
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
  const { width } = useWindowSize();
  const isMobile = width < 1281;

  useEffect(() => {
    console.log("DocumentSelection component mounted, fetching documents");
    console.log("Auth state:", { user: user?.id, role });
    fetchUserDocuments();
  }, [user, role]); // Added role as a dependency to re-fetch when role changes

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        console.log("Fetching documents for authenticated user:", user.id);
        const data = await fetchUserDocumentsFromSupabase(user.id);
        console.log("Documents fetched from Supabase:", data.length);
        const uniqueDocuments = deduplicateDocuments(data);
        setDocuments(uniqueDocuments);
      } else if (role) {
        console.log("Fetching documents for guest user with role:", role);
        try {
          // Check if we're in a context where localStorage is available
          if (typeof window !== 'undefined' && window.localStorage) {
            const uniqueDocs = fetchGuestDocumentsFromLocalStorage(role);
            console.log(`Documents fetched from localStorage for ${role}:`, uniqueDocs.length);
            setDocuments(uniqueDocs);
            
            // Check if we need to clean up duplicates
            const localDocs = localStorage.getItem(`${role}Documents`);
            if (localDocs && JSON.parse(localDocs).length !== uniqueDocs.length) {
              localStorage.setItem(`${role}Documents`, JSON.stringify(uniqueDocs));
              toast({
                title: "Duplicate documents removed",
                description: "We've cleaned up some duplicate documents for you.",
              });
            }
          } else {
            console.warn("localStorage is not available in this context");
            setDocuments([]);
          }
        } catch (error) {
          console.error("Error loading local documents:", error);
          setDocuments([]);
        }
      } else {
        console.log("No authenticated user or guest role found");
        setDocuments([]);
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
        const updatedDocs = deleteDocumentFromLocalStorage(documentToDelete, role);
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
      <div className={`mx-auto flex flex-col items-center ${isMobile ? 'w-full' : 'max-w-5xl'}`}>
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-wider text-editor-text mb-1 font-medium">
            {role === "designer" ? "Designer" : "Editor"}
          </p>
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

        <div className={`${isMobile ? 'w-full' : 'w-1/2'} mx-auto`}>
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

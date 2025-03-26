
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
  
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";
  const itemTypePlural = isDesigner ? "templates" : "documents";

  useEffect(() => {
    fetchUserDocuments();
  }, [user, role]);

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const data = await fetchUserDocumentsFromSupabase(user.id);
        const uniqueDocuments = deduplicateDocuments(data);
        setDocuments(uniqueDocuments);
      } else if (role) {
        try {
          // Handle both 'writer' and 'editor' (legacy) roles
          const storageKey = role === 'designer' ? 'designerDocuments' : 
                            (role === 'writer' ? 'writerDocuments' : 'editorDocuments');
          
          // For backward compatibility
          let uniqueDocs;
          if (role === 'writer') {
            // Try to get documents from both 'writerDocuments' and 'editorDocuments'
            const writerDocs = JSON.parse(localStorage.getItem('writerDocuments') || '[]');
            const legacyEditorDocs = JSON.parse(localStorage.getItem('editorDocuments') || '[]');
            
            // Merge and deduplicate
            uniqueDocs = deduplicateDocuments([...writerDocs, ...legacyEditorDocs]);
            
            // Save merged docs back to writerDocuments
            localStorage.setItem('writerDocuments', JSON.stringify(uniqueDocs));
          } else {
            uniqueDocs = fetchGuestDocumentsFromLocalStorage(role);
          }
          
          setDocuments(uniqueDocs);
        } catch (error) {
          console.error(`Error loading ${role} ${itemTypePlural}:`, error);
          setDocuments([]);
        }
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
        // Handle both writer and legacy editor roles
        const storageRole = role === 'writer' ? 'writer' : role;
        const updatedDocs = deleteDocumentFromLocalStorage(documentToDelete, storageRole);
        setDocuments(updatedDocs);
        
        // For writer role, also clean up any documents in the legacy 'editorDocuments'
        if (role === 'writer') {
          try {
            const legacyDocs = JSON.parse(localStorage.getItem('editorDocuments') || '[]');
            const filteredLegacyDocs = legacyDocs.filter((doc: Document) => doc.id !== documentToDelete);
            localStorage.setItem('editorDocuments', JSON.stringify(filteredLegacyDocs));
          } catch (e) {
            console.error("Error cleaning legacy editor documents:", e);
          }
        }
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
            className="text-base bg-black text-white hover:bg-black/80"
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

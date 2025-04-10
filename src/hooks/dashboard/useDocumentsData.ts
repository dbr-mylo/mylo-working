
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Document } from "@/lib/types";
import { useValidatedNavigation } from "@/hooks/useValidatedNavigation";
import { fetchUserDocumentsFromSupabase, fetchGuestDocumentsFromLocalStorage, deleteDocumentFromSupabase, deleteDocumentFromLocalStorage } from "@/utils/documentUtils";

export const useDocumentsData = (projectId?: string | null) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();
  const { navigateTo } = useValidatedNavigation();
  
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      
      try {
        let docs: Document[] = [];
        
        if (user?.id) {
          // Fetch from Supabase if user is authenticated
          docs = await fetchUserDocumentsFromSupabase(user.id);
        } else {
          // Fetch from localStorage for guests
          docs = fetchGuestDocumentsFromLocalStorage(role || '');
        }
        
        // Filter by project if a project ID is provided
        if (projectId) {
          docs = docs.filter(doc => doc.meta?.project_id === projectId);
        }
        
        setDocuments(docs);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [user, role, projectId]);
  
  const handleDeleteDocument = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      if (user?.id) {
        await deleteDocumentFromSupabase(documentId, user.id);
      } else {
        const updatedDocs = deleteDocumentFromLocalStorage(documentId, role || '');
        setDocuments(updatedDocs);
        return; // Exit early as we've already updated the state
      }
      
      // Update local state
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      toast.success("Document deleted");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };
  
  const handleSelectDocument = (documentId: string) => {
    if (documentId === "new") {
      navigateTo("/editor");
    } else {
      navigateTo(`/editor/${documentId}`);
    }
  };
  
  return {
    documents,
    isLoading,
    handleDeleteDocument,
    handleSelectDocument
  };
};


import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  saveDocumentToSupabase, 
  saveDocumentToLocalStorage 
} from "@/utils/documentSaveUtils";
import type { Document } from "@/lib/types";

export function useDocumentSave(
  content: string,
  documentTitle: string,
  currentDocumentId: string | null,
  setInitialContent: (content: string) => void,
  setCurrentDocumentId: (id: string | null) => void
) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveDocument = async (): Promise<void> => {
    try {
      console.log("Saving document with content length:", content ? content.length : 0);
      console.log("Content preview:", content ? content.substring(0, 100) : "empty");
      
      if (!content || !content.trim()) {
        toast({
          title: "Cannot save empty document",
          description: "Please add some content to your document before saving.",
          variant: "destructive",
        });
        return;
      }
      
      let savedDocument: Document | null = null;
      
      if (user) {
        console.log("Saving document for authenticated user:", user.id);
        savedDocument = await saveDocumentToSupabase(
          currentDocumentId, 
          content, 
          documentTitle, 
          user.id,
          toast
        );
      } else if (role) {
        console.log("Saving document for guest user with role:", role);
        savedDocument = saveDocumentToLocalStorage(
          currentDocumentId,
          content,
          documentTitle,
          toast
        );
      } else {
        toast({
          title: "Authentication required",
          description: "Please log in or continue as a guest to save documents.",
          variant: "destructive",
        });
        return;
      }
      
      if (savedDocument) {
        console.log("Document saved successfully with ID:", savedDocument.id);
        console.log("Saved content length:", savedDocument.content ? savedDocument.content.length : 0);
        console.log("Saved content preview:", savedDocument.content ? savedDocument.content.substring(0, 100) : "empty");
        
        // Update initialContent to mark that we've saved the current state
        setInitialContent(content);
        
        if (!currentDocumentId) {
          setCurrentDocumentId(savedDocument.id);
          navigate(`/editor/${savedDocument.id}`, { replace: true });
        }
      }
      
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
      
      return;
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document.",
        variant: "destructive",
      });
      return;
    }
  };

  return { saveDocument };
}

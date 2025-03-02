
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SaveDocumentResult } from "@/lib/types";
import { 
  saveDocumentToSupabase, 
  saveDocumentToLocalStorage 
} from "@/utils/documentSaveUtils";

export function useDocumentSave(
  content: string | undefined,
  documentTitle: string,
  currentDocumentId: string | null,
  setInitialContent: (content: string) => void,
  setCurrentDocumentId: (id: string | null) => void
) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveDocument = useCallback(async (): Promise<SaveDocumentResult> => {
    if (!content) {
      console.warn("Cannot save empty content");
      toast({
        title: "Cannot save",
        description: "The document cannot be empty.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      console.log("Saving document with title:", documentTitle);
      console.log("Content length:", content.length);
      console.log("Current document ID:", currentDocumentId);
      console.log("Current role:", role);
      
      let savedDoc;
      if (user) {
        console.log("Saving document for authenticated user:", user.id);
        savedDoc = await saveDocumentToSupabase(
          currentDocumentId, 
          content, 
          documentTitle, 
          user.id,
          toast
        );
      } else if (role) {
        console.log("Saving document for guest user with role:", role);
        savedDoc = saveDocumentToLocalStorage(
          currentDocumentId, 
          content, 
          documentTitle,
          role,
          toast
        );
      } else {
        console.error("No authenticated user or guest role found");
        toast({
          title: "Error saving document",
          description: "You need to be signed in or continue as a guest to save documents.",
          variant: "destructive",
        });
        return { success: false };
      }
      
      if (savedDoc) {
        console.log("Document saved successfully:", savedDoc.id);
        console.log("Saved content length:", savedDoc.content ? savedDoc.content.length : 0);
        
        setInitialContent(content);
        
        if (!currentDocumentId) {
          console.log("Redirecting to saved document:", savedDoc.id);
          setCurrentDocumentId(savedDoc.id);
          navigate(`/editor/${savedDoc.id}`, { replace: true });
        }
        
        toast({
          title: "Document saved",
          description: "Your document has been successfully saved.",
        });
        
        return { 
          success: true, 
          documentId: savedDoc.id 
        };
      } else {
        throw new Error("Failed to save document");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document.",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [content, documentTitle, currentDocumentId, user, role, toast, navigate, setInitialContent, setCurrentDocumentId]);

  return { saveDocument };
}

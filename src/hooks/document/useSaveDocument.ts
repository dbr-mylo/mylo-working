
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserRole, Document, DocumentMeta } from "@/lib/types";
import { 
  saveDocumentToSupabase, 
  saveDocumentToLocalStorage 
} from "@/utils/documentSaveUtils";

interface UseSaveDocumentProps {
  content: string;
  currentDocumentId: string | null;
  documentTitle: string;
  documentMeta?: DocumentMeta;
  user: any | null;
  role: UserRole | null;
  setInitialContent: (content: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  navigate: NavigateFunction;
}

export function useSaveDocument({
  content,
  currentDocumentId,
  documentTitle,
  documentMeta,
  user,
  role,
  setInitialContent,
  setCurrentDocumentId,
  navigate
}: UseSaveDocumentProps) {
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";

  const saveDocument = useCallback(async (): Promise<void> => {
    try {
      console.log(`Saving ${itemType} with content length:`, content ? content.length : 0);
      console.log(`Current role: ${role}, User authenticated: ${!!user}`);
      console.log(`Document ID: ${currentDocumentId || 'new'}, Title: ${documentTitle}`);
      
      if (!content || !content.trim()) {
        console.log(`Cannot save empty ${itemType}`);
        toast({
          title: `Cannot save empty ${itemType}`,
          description: `Please add some content to your ${itemType} before saving.`,
          variant: "destructive",
        });
        return;
      }
      
      let savedDocument: Document | null = null;
      
      if (user) {
        console.log(`Saving ${itemType} for authenticated user:`, user.id);
        // Fix: Adjust the arguments to match the expected parameter count (5-6)
        savedDocument = await saveDocumentToSupabase(
          currentDocumentId, 
          content, 
          documentTitle, 
          user.id,
          toast,
          isDesigner
        );
        console.log(`Supabase save completed for ${itemType}`);
      } else if (role) {
        console.log(`Saving ${itemType} for ${role} user to localStorage`);
        // Fix: Adjust the arguments to match the expected parameter count (5)
        savedDocument = saveDocumentToLocalStorage(
          currentDocumentId,
          content,
          documentTitle,
          role,
          toast
        );
        console.log(`localStorage save completed for ${itemType}`);
      } else {
        console.log('No role or user, cannot save');
        toast({
          title: "Authentication required",
          description: `Please log in or continue as a guest to save ${isDesigner ? "templates" : "documents"}.`,
          variant: "destructive",
        });
        return;
      }
      
      if (savedDocument) {
        console.log(`${isDesigner ? "Template" : "Document"} saved successfully with ID:`, savedDocument.id);
        
        setInitialContent(content);
        console.log('Initial content updated with current content');
        
        if (!currentDocumentId) {
          setCurrentDocumentId(savedDocument.id);
          console.log(`New document ID set: ${savedDocument.id}`);
          navigate(`/editor/${savedDocument.id}`, { replace: true });
          console.log(`Navigation to /editor/${savedDocument.id}`);
        }
      }
      
      toast({
        title: `${isDesigner ? "Template" : "Document"} saved`,
        description: "Your changes have been saved successfully.",
      });
      
      return;
    } catch (error) {
      console.error(`Error saving ${itemType}:`, error);
      toast({
        title: `Error saving ${itemType}`,
        description: `There was a problem saving your ${itemType}.`,
        variant: "destructive",
      });
      return;
    }
  }, [content, currentDocumentId, documentTitle, documentMeta, user, role, setInitialContent, setCurrentDocumentId, navigate, toast]);

  return { saveDocument };
}


import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserRole, Document } from "@/lib/types";
import { 
  saveDocumentToSupabase, 
  saveDocumentToLocalStorage 
} from "@/utils/documentSaveUtils";
import { TemplatePreferences } from "@/lib/types/preferences";

interface UseSaveDocumentProps {
  content: string;
  currentDocumentId: string | null;
  documentTitle: string;
  preferences: TemplatePreferences | null;
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
  preferences,
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
      console.log("Content preview:", content ? content.substring(0, 100) : "empty");
      console.log("Preferences:", preferences);
      
      if (!content || !content.trim()) {
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
        savedDocument = await saveDocumentToSupabase(
          currentDocumentId, 
          content, 
          documentTitle, 
          user.id,
          toast,
          isDesigner,
          preferences
        );
      } else if (role) {
        console.log(`Saving ${itemType} for ${role} user`);
        savedDocument = saveDocumentToLocalStorage(
          currentDocumentId,
          content,
          documentTitle,
          role,
          toast,
          preferences
        );
      } else {
        toast({
          title: "Authentication required",
          description: `Please log in or continue as a guest to save ${isDesigner ? "templates" : "documents"}.`,
          variant: "destructive",
        });
        return;
      }
      
      if (savedDocument) {
        console.log(`${isDesigner ? "Template" : "Document"} saved successfully with ID:`, savedDocument.id);
        console.log("Saved content length:", savedDocument.content ? savedDocument.content.length : 0);
        console.log("Saved content preview:", savedDocument.content ? savedDocument.content.substring(0, 100) : "empty");
        
        setInitialContent(content);
        
        if (!currentDocumentId) {
          setCurrentDocumentId(savedDocument.id);
          navigate(`/editor/${savedDocument.id}`, { replace: true });
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
  }, [content, currentDocumentId, documentTitle, preferences, user, role, setInitialContent, setCurrentDocumentId, navigate, toast]);

  return { saveDocument };
}


import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchDocumentFromSupabase, 
  fetchDocumentFromLocalStorage,
  loadDocument 
} from "@/utils/documentFetchUtils";
import { UserRole } from "@/lib/types";

interface UseFetchDocumentProps {
  setContent: (content: string) => void;
  setInitialContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  user: any | null;
  role: UserRole | null;
  navigate: NavigateFunction;
}

export function useFetchDocument({
  setContent,
  setInitialContent,
  setDocumentTitle,
  setCurrentDocumentId,
  setIsLoading,
  user,
  role,
  navigate
}: UseFetchDocumentProps) {
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";

  const fetchDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      console.warn("Document fetch timeout reached, using fallback or proceeding");
      setIsLoading(false);
    }, 10000); // 10 second timeout

    try {
      console.log(`Fetching ${itemType} with ID:`, id);
      
      let documentData = null;
      
      if (user) {
        console.log("Fetching for authenticated user:", user.id);
        documentData = await fetchDocumentFromSupabase(id, user.id, toast);
      } 
      
      // If Supabase fetch failed or user is not authenticated, try localStorage
      if (!documentData && role) {
        console.log(`No document from Supabase, fetching for ${role} user from localStorage`);
        documentData = fetchDocumentFromLocalStorage(id, role, toast);
      }
      
      if (documentData) {
        console.log(`${isDesigner ? "Template" : "Document"} fetched:`, documentData.id);
        
        if (documentData.content) {
          setContent(documentData.content);
          setInitialContent(documentData.content);
        } else {
          console.warn(`${isDesigner ? "Template" : "Document"} has no content!`);
          setContent("");
          setInitialContent("");
        }
        
        setDocumentTitle(documentData.title || "");
        setCurrentDocumentId(documentData.id);
      } else {
        console.log("No document found, redirecting to home");
        toast({
          title: `${isDesigner ? "Template" : "Document"} not found`,
          description: "Redirecting to home page",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error(`Error fetching ${itemType}:`, error);
      toast({
        title: `Error loading ${itemType}`,
        description: "There was a problem loading your content. Redirecting to home page.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [user, role, setContent, setInitialContent, setDocumentTitle, setCurrentDocumentId, setIsLoading, navigate, toast, isDesigner]);

  return { fetchDocument };
}

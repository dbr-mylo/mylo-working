
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchDocumentFromSupabase, 
  fetchDocumentFromLocalStorage 
} from "@/utils/documentFetchUtils";

export function useDocumentFetch(
  documentId: string | undefined,
  setContent: (content: string) => void,
  setInitialContent: (content: string) => void,
  setDocumentTitle: (title: string) => void,
  setCurrentDocumentId: (id: string | null) => void,
  setIsLoading: (isLoading: boolean) => void
) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (documentId) {
      console.log("DocumentId changed, fetching document:", documentId);
      fetchDocument(documentId);
    } else {
      // Reset content state when no document ID is provided
      console.log("No document ID provided, resetting content state");
      setContent("");
      setInitialContent("");
      setDocumentTitle("");
      setCurrentDocumentId(null);
      setIsLoading(false);
    }
  }, [documentId, user, role]); // Added role as dependency

  const fetchDocument = async (id: string) => {
    setIsLoading(true);
    try {
      console.log("Fetching document with ID:", id);
      
      if (user) {
        console.log("Fetching for authenticated user:", user.id);
        const data = await fetchDocumentFromSupabase(id, user.id, toast);
        if (data) {
          console.log("Document fetched from Supabase:", data.id);
          console.log("Content length from Supabase:", data.content ? data.content.length : 0);
          
          if (data.content) {
            setContent(data.content);
            setInitialContent(data.content);
          } else {
            console.warn("Document has no content!");
            setContent("");
            setInitialContent("");
          }
          
          if (data.title) {
            setDocumentTitle(data.title);
          }
          setCurrentDocumentId(data.id);
        } else {
          navigate('/');
          return;
        }
      } else if (role) {
        console.log("Fetching for guest user with role:", role);
        const doc = fetchDocumentFromLocalStorage(id, role, toast);
        if (doc) {
          console.log(`Document fetched from localStorage for ${role}:`, doc.id);
          console.log("Content length from localStorage:", doc.content ? doc.content.length : 0);
          console.log("Document title from localStorage:", doc.title || "");
          
          // Ensure we're correctly setting content from the fetched document
          setContent(doc.content || "");
          setInitialContent(doc.content || "");
          setDocumentTitle(doc.title || "");
          setCurrentDocumentId(doc.id);
          
          // Log to verify content is being set correctly
          console.log("Content set in state:", doc.content ? doc.content.substring(0, 50) + "..." : "empty");
        } else {
          console.error("Document not found in localStorage, redirecting to home");
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error loading document",
        description: "There was a problem loading your document.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchDocument };
}

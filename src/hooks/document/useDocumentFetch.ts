
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
      setContent("");
      setInitialContent("");
      setDocumentTitle("");
      setCurrentDocumentId(null);
      setIsLoading(false);
    }
  }, [documentId, user]);

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
          console.log("Content preview:", data.content ? data.content.substring(0, 100) : "empty");
          
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
        const doc = fetchDocumentFromLocalStorage(id, toast);
        if (doc) {
          console.log("Document fetched from localStorage:", doc.id);
          console.log("Content length from localStorage:", doc.content ? doc.content.length : 0);
          console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
          
          if (doc.content) {
            setContent(doc.content);
            setInitialContent(doc.content);
            
            // Double-check state after setting
            setTimeout(() => {
              console.log("Verify content was set:", content ? content.substring(0, 100) : "empty");
            }, 100);
          } else {
            console.warn("Document from localStorage has no content!");
            setContent("");
            setInitialContent("");
          }
          
          setDocumentTitle(doc.title || "");
          setCurrentDocumentId(doc.id);
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

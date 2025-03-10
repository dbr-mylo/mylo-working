
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchDocumentFromSupabase, 
  fetchDocumentFromLocalStorage 
} from "@/utils/documentFetchUtils";
import { UserRole } from "@/lib/types";
import { TemplatePreferences } from "@/lib/types/preferences";

interface UseFetchDocumentProps {
  setContent: (content: string) => void;
  setInitialContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setPreferences: (preferences: TemplatePreferences | null) => void;
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
  setPreferences,
  user,
  role,
  navigate
}: UseFetchDocumentProps) {
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";

  const fetchDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching ${itemType} with ID:`, id);
      
      if (user) {
        console.log("Fetching for authenticated user:", user.id);
        const data = await fetchDocumentFromSupabase(id, user.id, toast);
        if (data) {
          console.log(`${isDesigner ? "Template" : "Document"} fetched from Supabase:`, data.id);
          console.log("Content length from Supabase:", data.content ? data.content.length : 0);
          console.log("Content preview:", data.content ? data.content.substring(0, 100) : "empty");
          
          if (data.content) {
            setContent(data.content);
            setInitialContent(data.content);
          } else {
            console.warn(`${isDesigner ? "Template" : "Document"} has no content!`);
            setContent("");
            setInitialContent("");
          }
          
          if (data.title) {
            setDocumentTitle(data.title);
          }
          setCurrentDocumentId(data.id);
          
          // Handle preferences
          if (data.preferences) {
            try {
              const parsedPreferences = typeof data.preferences === 'string' 
                ? JSON.parse(data.preferences) 
                : data.preferences;
              setPreferences(parsedPreferences);
              console.log("Loaded preferences:", parsedPreferences);
            } catch (error) {
              console.error("Error parsing preferences:", error);
              setPreferences(null);
            }
          } else {
            setPreferences(null);
          }
        } else {
          navigate('/');
          return;
        }
      } else if (role) {
        console.log(`Fetching for ${role} user`);
        const doc = fetchDocumentFromLocalStorage(id, role, toast);
        if (doc) {
          console.log(`${isDesigner ? "Template" : "Document"} fetched from localStorage for ${role}:`, doc.id);
          console.log("Content length from localStorage:", doc.content ? doc.content.length : 0);
          console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
          
          if (doc.content) {
            setContent(doc.content);
            setInitialContent(doc.content);
            
            setTimeout(() => {
              // Use a different approach to verify content was set without referencing content directly
              console.log("Verify content setting complete");
            }, 100);
          } else {
            console.warn(`Document from localStorage for ${role} has no content!`);
            setContent("");
            setInitialContent("");
          }
          
          setDocumentTitle(doc.title || "");
          setCurrentDocumentId(doc.id);
          
          // Handle preferences
          if (doc.preferences) {
            try {
              const parsedPreferences = typeof doc.preferences === 'string' 
                ? JSON.parse(doc.preferences) 
                : doc.preferences;
              setPreferences(parsedPreferences);
              console.log("Loaded preferences:", parsedPreferences);
            } catch (error) {
              console.error("Error parsing preferences:", error);
              setPreferences(null);
            }
          } else {
            setPreferences(null);
          }
        } else {
          console.error(`${isDesigner ? "Template" : "Document"} not found in localStorage for ${role}, redirecting to home`);
          navigate('/');
        }
      }
    } catch (error) {
      console.error(`Error fetching ${itemType}:`, error);
      toast({
        title: `Error loading ${itemType}`,
        description: `There was a problem loading your ${itemType}.`,
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [user, role, setContent, setInitialContent, setDocumentTitle, setCurrentDocumentId, setIsLoading, setPreferences, navigate, toast]);

  return { fetchDocument };
}

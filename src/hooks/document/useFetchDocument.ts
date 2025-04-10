import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserRole, DocumentMeta } from "@/lib/types";

interface UseFetchDocumentProps {
  setContent: (content: string) => void;
  setInitialContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDocumentMeta: (meta: DocumentMeta | undefined) => void;
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
  setDocumentMeta,
  user,
  role,
  navigate
}: UseFetchDocumentProps) {
  const { toast } = useToast();
  
  const fetchDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching document with ID: ${documentId}`);
      
      // Simulate fetching document from API/database
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock document data for demo
        const mockDocument = {
          id: documentId,
          title: `Document ${documentId}`,
          content: `<h1>Document ${documentId} Content</h1><p>This is sample content.</p>`,
          meta: {
            template_id: "template-123",
            created_by: user?.id || "anonymous",
            // other meta fields as needed
          }
        };
        
        console.log(`Document fetched:`, mockDocument);
        
        setContent(mockDocument.content);
        setInitialContent(mockDocument.content);
        setDocumentTitle(mockDocument.title);
        setCurrentDocumentId(mockDocument.id);
        setDocumentMeta(mockDocument.meta);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error",
        description: "Failed to load document. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      navigate("/");
    }
  }, [setContent, setInitialContent, setDocumentTitle, setCurrentDocumentId, setIsLoading, setDocumentMeta, user, toast, navigate]);

  return { fetchDocument };
}

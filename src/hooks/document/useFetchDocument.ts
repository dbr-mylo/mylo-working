import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { useRoleAwareErrorHandling } from "@/hooks/useErrorHandling";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { UserRole, DocumentMeta } from "@/lib/types";
import { classifyError, ErrorCategory } from "@/utils/error/errorClassifier";

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
  const { handleRoleAwareError, withErrorHandling } = useRoleAwareErrorHandling();
  const { isOnline } = useOnlineStatus();
  
  const fetchDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching document with ID: ${documentId}`);
      
      // Check for online status before attempting to fetch
      if (!isOnline) {
        toast.warning("You're offline", {
          description: "Loading from local cache. Some content may be unavailable.",
        });
      }
      
      // Simulate fetching document from API/database
      // In a real app, this would be an API call
      const fetchPromise = new Promise((resolve, reject) => {
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
          resolve(mockDocument);
        }, 500);
      });
      
      // Wrap the promise in a timeout to simulate network issues
      const documentData = await Promise.race([
        fetchPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out")), 5000)
        )
      ]);
      
      // Use the document data
      const typedDocument = documentData as { 
        id: string; 
        title: string; 
        content: string; 
        meta: DocumentMeta 
      };
      
      setContent(typedDocument.content);
      setInitialContent(typedDocument.content);
      setDocumentTitle(typedDocument.title);
      setCurrentDocumentId(typedDocument.id);
      setDocumentMeta(typedDocument.meta);
    } catch (error) {
      console.error("Error fetching document:", error);
      
      // Classify the error to provide appropriate feedback
      const classifiedError = classifyError(error, "document.fetch");
      
      if (classifiedError.category === ErrorCategory.NETWORK) {
        toast.error("Network Error", {
          description: "Failed to load document. Check your connection and try again.",
        });
      } else {
        toast.error("Error", {
          description: "Failed to load document. Please try again.",
        });
      }
      
      handleRoleAwareError(error, "document.fetch", "Failed to load document");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [
    setContent, 
    setInitialContent, 
    setDocumentTitle, 
    setCurrentDocumentId, 
    setIsLoading, 
    setDocumentMeta, 
    user, 
    navigate, 
    handleRoleAwareError,
    isOnline
  ]);

  // Wrap fetchDocument with error handling
  const safeFetchDocument = withErrorHandling(
    fetchDocument,
    "document.fetch",
    "Failed to load document"
  );

  return { 
    fetchDocument: safeFetchDocument,
    // Also export the unwrapped function for cases where custom error handling is needed
    fetchDocumentRaw: fetchDocument 
  };
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Document, UseDocumentReturn } from "@/lib/types";
import { 
  fetchDocumentFromSupabase, 
  fetchDocumentFromLocalStorage,
  loadDocument as loadDocumentUtil
} from "@/utils/documentFetchUtils";
import { 
  saveDocumentToSupabase, 
  saveDocumentToLocalStorage 
} from "@/utils/documentSaveUtils";

export function useDocument(documentId: string | undefined): UseDocumentReturn {
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (documentId) {
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
      if (user) {
        const data = await fetchDocumentFromSupabase(id, user.id, toast);
        if (data) {
          if (data.content) {
            setContent(data.content);
            setInitialContent(data.content);
          } else {
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
        const doc = fetchDocumentFromLocalStorage(id, toast);
        if (doc) {
          setContent(doc.content || "");
          setInitialContent(doc.content || "");
          setDocumentTitle(doc.title || "");
          setCurrentDocumentId(doc.id);
        } else {
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

  const saveDocument = async (): Promise<void> => {
    try {
      console.log("Saving document with content length:", content.length);
      
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
        if (!currentDocumentId) {
          setCurrentDocumentId(savedDocument.id);
          navigate(`/editor/${savedDocument.id}`, { replace: true });
        }
        setInitialContent(content);
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

  const loadDocument = (doc: Document) => {
    const loadedDoc = loadDocumentUtil(doc);
    
    setContent(loadedDoc.content);
    setInitialContent(loadedDoc.initialContent);
    setDocumentTitle(loadedDoc.documentTitle);
    setCurrentDocumentId(loadedDoc.currentDocumentId);
  };

  return {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    isLoading,
    saveDocument,
    loadDocument
  };
}


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

  // Debug log whenever content changes
  useEffect(() => {
    console.log("Content updated in useDocument hook:", content.substring(0, 100));
    console.log("Content length:", content.length);
  }, [content]);

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
      console.log("Fetching document with ID:", id);
      
      if (user) {
        console.log("Fetching for authenticated user:", user.id);
        const data = await fetchDocumentFromSupabase(id, user.id, toast);
        if (data) {
          console.log("Document fetched from Supabase:", data.id);
          console.log("Content length from Supabase:", data.content?.length || 0);
          
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
          console.log("Content length from localStorage:", doc.content?.length || 0);
          
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
      console.log("Content preview:", content.substring(0, 100));
      
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
        console.log("Saved content length:", savedDocument.content.length);
        
        // Update initialContent to mark that we've saved the current state
        setInitialContent(content);
        
        if (!currentDocumentId) {
          setCurrentDocumentId(savedDocument.id);
          navigate(`/editor/${savedDocument.id}`, { replace: true });
        }
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
    console.log("Loading document:", doc.id);
    console.log("Content length from document:", doc.content?.length || 0);
    
    const loadedDoc = loadDocumentUtil(doc);
    
    console.log("Processed content length:", loadedDoc.content.length);
    
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

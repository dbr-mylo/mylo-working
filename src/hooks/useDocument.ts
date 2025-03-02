
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
    console.log("Content updated in useDocument hook:", content ? content.substring(0, 100) : "empty");
    console.log("Content length:", content ? content.length : 0);
  }, [content]);

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

  const saveDocument = async (): Promise<void> => {
    try {
      console.log("Saving document with content length:", content ? content.length : 0);
      console.log("Content preview:", content ? content.substring(0, 100) : "empty");
      
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
        console.log("Saved content length:", savedDocument.content ? savedDocument.content.length : 0);
        console.log("Saved content preview:", savedDocument.content ? savedDocument.content.substring(0, 100) : "empty");
        
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
    console.log("Content length from document:", doc.content ? doc.content.length : 0);
    console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
    
    const loadedDoc = loadDocumentUtil(doc);
    
    console.log("Processed content length:", loadedDoc.content ? loadedDoc.content.length : 0);
    console.log("Processed content preview:", loadedDoc.content ? loadedDoc.content.substring(0, 100) : "empty");
    
    setContent(loadedDoc.content);
    setInitialContent(loadedDoc.initialContent);
    setDocumentTitle(loadedDoc.documentTitle);
    setCurrentDocumentId(loadedDoc.currentDocumentId);
    
    // Verify content is set correctly
    setTimeout(() => {
      console.log("Verification - content after setting:", content);
    }, 100);
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

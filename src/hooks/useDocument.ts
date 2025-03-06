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
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";

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
  }, [documentId, user, role]);

  const fetchDocument = async (id: string) => {
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
              console.log("Verify content was set:", content ? content.substring(0, 100) : "empty");
            }, 100);
          } else {
            console.warn(`Document from localStorage for ${role} has no content!`);
            setContent("");
            setInitialContent("");
          }
          
          setDocumentTitle(doc.title || "");
          setCurrentDocumentId(doc.id);
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
  };

  const saveDocument = async (): Promise<void> => {
    try {
      console.log(`Saving ${itemType} with content length:`, content ? content.length : 0);
      console.log("Content preview:", content ? content.substring(0, 100) : "empty");
      
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
          toast
        );
      } else if (role) {
        console.log(`Saving ${itemType} for ${role} user`);
        savedDocument = saveDocumentToLocalStorage(
          currentDocumentId,
          content,
          documentTitle,
          role,
          toast
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
  };

  const loadDocument = (doc: Document) => {
    console.log(`Loading ${itemType}:`, doc.id);
    console.log("Content length from document:", doc.content ? doc.content.length : 0);
    console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
    
    const loadedDoc = loadDocumentUtil(doc);
    
    console.log("Processed content length:", loadedDoc.content ? loadedDoc.content.length : 0);
    console.log("Processed content preview:", loadedDoc.content ? loadedDoc.content.substring(0, 100) : "empty");
    
    setContent(loadedDoc.content);
    setInitialContent(loadedDoc.initialContent);
    setDocumentTitle(loadedDoc.documentTitle);
    setCurrentDocumentId(loadedDoc.currentDocumentId);
    
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
